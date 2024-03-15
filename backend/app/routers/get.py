from flask import Blueprint, request, Flask, jsonify, make_response, session
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


# 연결에 필요한 정보
rds_host = 'capstone-database.c5ys4ks8sbyz.us-west-2.rds.amazonaws.com'
rds_port = '3306'
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

        cursor = conn.cursor()
        cursor.execute(f"SELECT * FROM {table_name}")
        columns = [col[0] for col in cursor.description]

        data = []

        for row in cursor.fetchall():
            row_data = {}
            for i, value in enumerate(row):
                if columns[i] == 'date':  # date 열인 경우
                    row_data[columns[i]] = value.strftime("%Y-%m-%d")  # 문자열로 변환하여 처리
                elif columns[i] == 'time':  # time 열인 경우
                    row_data[columns[i]] = str(value)  # 문자열로 변환하여 처리
                else:
                    row_data[columns[i]] = value
            data.append(row_data)

        cursor.close()
        return jsonify({"message": "POST request received", "data": data})
    

#def visualization(data)

    