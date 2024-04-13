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
#from .authentication import createToken, validateToken, validatePassword, hashPassword
session = requests.session()

bp = Blueprint('posts', __name__ )


jupyter_note_host = "host.docker.internal"
jupyter_note_port = 8000
drawtable_url = f"http://{jupyter_note_host}:{jupyter_note_port}/drawtable"

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

@bp.route('/users', methods = ['POST'])
def create_user(user_id: int):
    return {'id': user_id}

@bp.route('/createtable', methods =['POST'])
def create_table():
    content = request.get_json()
    col1 = "date"
    col2 = "time"
    col3 = "maximum_temperature"
    col4 = "lowest_temperature"
    col5 = "pop"
    col6 = "pressure"
    col7 = "humidity"
    col8 = "description"
    city_name = content['city']
    try:
        with conn.cursor() as cursor:
            # DB selection
            cursor.execute(f"USE {rds_database}")
            # table query creation
            sql = f"CREATE TABLE IF NOT EXISTS {city_name} ("
            sql += "id INT AUTO_INCREMENT PRIMARY KEY,"
            sql += f"{col1} DATE,"
            sql += f"{col2} TIME,"
            sql += f"{col3} FLOAT,"
            sql += f"{col4} FLOAT,"
            sql += f"{col5} FLOAT,"
            sql += f"{col6} FLOAT,"
            sql += f"{col7} FLOAT,"
            sql += f"{col8} TEXT"
            sql += ")"

            cursor.execute(sql)

            # JSON 데이터에서 내용 추출 및 쿼리 실행
            for data in content['list']:
                dt_txt = data['dt_txt']
                date, time = dt_txt.split()
                max_temp = data['main']['temp_max']
                min_temp = data['main']['temp_min']
                pop = data['pop']
                pressure = data['main']['pressure']
                humidity = data['main']['humidity']
                description = data['weather'][0]['description']
                print("==",date, time, max_temp, min_temp, pop, pressure, humidity, description)

                # 쿼리 작성 및 실행
                insert_sql = f"INSERT INTO {city_name} ({col1}, {col2}, {col3}, {col4}, {col5}, {col6}, {col7}, {col8}) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
                cursor.execute(insert_sql, (date, time, max_temp, min_temp, pop, pressure, humidity, description))
                conn.commit()

            print(f"Table '{city_name}' has been created successfully.")

    except Exception as e:
        # Error
        print("Error::", e)
    finally:
        return jsonify({"message": "Table successfully created"})

@bp.route('/login', methods = ['POST'])
def login():
    user = json.loads(request.data)
    if "password" in user and "email" in user:
        query_data = execute_query(
            "SELECT name, password, id FROM user WHERE email = %s"
        , (user['email']))
        #0 - Name. 1- Password
        err, message, status = validatePassword(user['password'].encode('utf-8'), query_data[0][1].encode('utf-8'), query_data[0][2], query_data[0][0])
        if err:
            return {"error": message}, status
        return{"token": message}, status
        
    return {"error" : "Missing one or more fields!"}, 400

@bp.route('/register', methods = ['POST'])
def register():
    user = json.loads(request.data)
    if "name" in user and "password" in user and "email" in user:
        #encrypt password for storage
        hashed_password = hashPassword(user["password"].encode('utf-8'))
        
        #delete password so we can send the user back
        if 'password' in user:
            del user['password']

        #add user to the table
        error, result = execute_query(
            "INSERT INTO user (email, name, password) VALUES (%s, %s, %s)" , (user['email'], user['name'], hashed_password)
        )

        #handle errors
        if error:
            return {"error" : result}, 400
        
        return(user)
            
    return {"error" : "Missing one or more fields!"}, 400


@bp.route('/checktable', methods = ['GET'])
def check_table():
    cursor = conn.cursor()
    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()
    print("Tables in the database:")
    for table in tables:
        print(table[0])

    cursor.close()  # 커서 닫기

    return {"Success" : "Table was created!"}

@bp.route('/get-table', methods=['POST'])
def get_table():
    if request.method == 'POST':
        content = request.get_json()
        print("content type: ", type(content))
        table_name = content['table_name']
        print("table_name", type(table_name))
        response = requests.post(drawtable_url, json=content, verify = False)
        print(response)
        
        return response.content
