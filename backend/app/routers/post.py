from flask import Blueprint, request, Flask, jsonify, make_response, session
from typing import Optional
import pymysql
import requests
import json

# MySQL connect
conn = pymysql.connect(
    host='127.0.0.1',
    user = 'root', 
    password = 'wjdanr90', 
    db='capstone', 
    charset='utf8',
    cursorclass=pymysql.cursors.DictCursor
)



bp = Blueprint('posts', __name__ )

@bp.route('/users', methods = ['POST'])
def create_user(user_id: int):
    return {'id': user_id}

@bp.route('/datafetch', methods = ['POST'])
def fetch_data():
    content = request.get_json()
    if content:
        
        print("Successfully POST request was sent from frontend!")
        save_to_database(content)
    else:
        print("failed to POST request")
    
    return {
        "status": 200,
        "data": content
    }

def save_to_database(content):
    try:
        with conn.cursor() as cursor:
            sql = f"INSERT INTO your_table (content) VALUES (%s)"
            cursor.execute(sql, (content, ))
            conn.commit()
    except Exception as e:
        print("Error:", e)
    finally:
        conn.close()



