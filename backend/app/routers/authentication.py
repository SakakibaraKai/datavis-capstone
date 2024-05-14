import jwt
import bcrypt
import os
from dotenv import load_dotenv
from jwt.exceptions import InvalidSignatureError

load_dotenv()

def validateToken(token : str):
    token_secret : str = os.getenv('JWT_SECRET')
    print(token_secret)
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