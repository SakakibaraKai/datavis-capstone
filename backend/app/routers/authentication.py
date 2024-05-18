import jwt
import bcrypt
import os
from dotenv import load_dotenv
from jwt.exceptions import InvalidTokenError, ExpiredSignatureError, DecodeError
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
    except ExpiredSignatureError:
        return True, "The token has expired."
    except DecodeError:
        return True, "The token is improperly formed."
    except InvalidTokenError:
        return True, "Invalid Token"
    except Exception as e:
        return True, f"An unexpected error occurred: {str(e)}"

    
def createToken(id, name, adminstatus):
    token_secret : str = os.getenv('JWT_SECRET')
    token = jwt.encode({
        "id" : id,
        "name" : name,
        "is_admin" : adminstatus
    }, "token_secret", algorithm="HS256")

    return token


def validatePassword(password, hashedPassword, id, name, adminstatus):
    if bcrypt.checkpw(password, hashedPassword):
        token = createToken(id, name, adminstatus)
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
        return {"error" : "Not valid"}, 400
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
        return {"error" : "Not valid"}, 400
    return decoratedFunction