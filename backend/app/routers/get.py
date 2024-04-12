from flask import Blueprint, request, Flask, jsonify, make_response, session, send_file
from typing import Optional
import requests
import json
import pymysql
import bcrypt
from pymysql import err
#from .sqlsetup import execute_query
import uuid
import mysql.connector
import datetime

jupyter_note_url = "http://127.0.0.1:8000/drawtable"
 
# 연결에 필요한 정보
rds_host = 'capstone-database.c5ys4ks8sbyz.us-west-2.rds.amazonaws.com'
rds_port = 3306
rds_user = 'admin'  # 사용자명 입력
rds_password = 'capstone'  # 비밀번호 입력
rds_database = 'capstone'  # 데이터베이스 이름 입력
# AWS RDS에 데이터베이스 연결
conn = mysql.connector.connect(
    host=rds_host,
    port=rds_port,
    user=rds_user,
    password=rds_password,
    database=rds_database
)

bp = Blueprint('/gets', __name__)

@bp.route('/', methods = ['GET'])
def root():
    return {'main': 'this is the main route'}

@bp.route('/tablelist', methods = ['GET', 'POST'])
def show_tables():
    if request.method == 'GET':
        cursor = conn.cursor()
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        table_list = [table[0] for table in tables]
        cursor.close() 

        return {"tables" : table_list}
    
    elif request.method == 'POST':
        
        content = request.get_json()
        table_name = content.get("table_name")
        data = {
            "table_name": table_name
        }
        # POST 요청 보내기
        response = requests.post(jupyter_note_url, json=data) 
        
        # 응답 확인
        if response.status_code == 200:
            response_data = response.json()
            # 이미지가 있는지 확인하고 있으면 클라이언트에게 반환
            encoded_image = response_data.get("encoded_image")
            if encoded_image:
                return jsonify({"encoded_image": encoded_image})
            else:
                return jsonify({"message": "No image found"})
        else: 
            return jsonify({"message": f"Request failed with status code {response.status_code}"})
    else:
        return jsonify({"message": "GET method not supported"})
    
