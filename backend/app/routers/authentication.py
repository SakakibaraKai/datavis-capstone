import jwt
import bcrypt
import os
from dotenv import load_dotenv
from jwt.exceptions import InvalidSignatureError
from functools import wraps
import requests
from .sqlsetup import execute_query
from flask import request


load_dotenv()


def validateToken(token : str):
    token_secret : str = os.getenv('JWT_SECRET')
    try:
        payload = jwt.decode(token, "token_secret", algorithms=["HS256"]) 
        return False, payload
    except InvalidSignatureError as e:
        return True, "Invalid Token"

    
def createToken(id, name):
    token_secret : str = os.getenv('JWT_SECRET')
    token = jwt.encode({
        "id" : id,
        "name" : name,
    }, "token_secret", algorithm="HS256")

    return token


def validatePassword(password, hashedPassword, id, name):
    if bcrypt.checkpw(password, hashedPassword):
        token = createToken(id, name)
        return False, token, 200
    return True, "Unauthorized", 401


def hashPassword(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password, salt) 


def isAuthorizedAdmin(func):
    @wraps(func)
    def decoratedFunction(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = str(auth_header.split(' ')[1])
            err, status = validateToken(token)
            if (err):
                return {"error" : "Not valid"}, 400
            
            payload = jwt.decode(token, "token_secret", algorithms=["HS256"]) 
            id = int(payload['id'])
            query_data = execute_query(
                "SELECT is_admin FROM user WHERE id = %s"
            , id)
            
            if query_data[0][0] != 1:
                return {"error" : "Not valid"}, 400
            return func(*args, **kwargs)
    return decoratedFunction

def isAuthorized(func):
    @wraps(func)
    def decoratedFunction(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = str(auth_header.split(' ')[1])
            err, status = validateToken(token)
            if (err):
                return {"error" : "Not valid"}, 400
            return func(*args, **kwargs)
    return decoratedFunction