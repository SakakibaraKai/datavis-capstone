from flask import Blueprint, request, Flask, jsonify, make_response, session
from typing import Optional
import requests
import json
import pymysql
#import bcrypt
#from .sqlsetup import execute_query

bp = Blueprint('posts', __name__ )

# Mysql connection
conn = pymysql.connect(
    host='host.docker.internal',
    user='root',
    password='wjdanr90',
    charset='utf8mb4',
    cursorclass=pymysql.cursors.DictCursor
)

@bp.route('/users', methods = ['POST'])
def create_user(user_id: int):
    return {'id': user_id}

@bp.route('/datafetch', methods = ['POST'])
def fetch_data():
    content = request.get_json()
    if content:
        print("Successfully POST request was sent from frontend!")
        create_db(content)
    else:
        print("failed to POST request")
    
    return {
        "status": 200,
        "data": content
    }

def create_db(content):
    print("==", content['city']) # corvallis
    cityName = content['city']
    cityDB = content['city'] + "DB"

    try: 
        with conn.cursor() as cursor:
            # SQL query execute()
            drop_db = f"DROP DATABASE IF EXISTS {cityDB}"
            cursor.execute(drop_db)
            conn.commit()
            sql = f"CREATE DATABASE {cityDB}"
            cursor.execute(sql)
            conn.commit()
            print(f"Database '{cityDB}' has been dropped and created successfully.")
            create_initial_table(content, cityDB, cityName)

    except Exception as e:
        # Error
        print("==Error:", e)

def create_initial_table(content, drop_db, city_name):
    col1 = "date"
    col2 = "time"
    col3 = "maximum_temperature"
    col4 = "lowest_temperature"
    col5 = "pop"
    col6 = "pressure"
    col7 = "humidity"
    col8 = "description"
    try:
        with conn.cursor() as cursor:
            # DB selection
            cursor.execute(f"USE {drop_db}")
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
        # close connection
        conn.close()

@bp.route('/create', methods = ['POST'])
def create_table():
    content = request.get_json()
    print(content)

    if(content):
        print("Success")
    else:
        print("failed")

# def validateToken(token:str):



@bp.route('/register', methods = ['POST'])
def register():
    user = json.loads(request.data)
    if "name" in user and "password" in user and "email" in user:
        #encrypt password for storage
        bytes = user["password"].encode('utf-8') 
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(bytes, salt) 
        
        #delete password so we can send the user back
        if 'password' in user:
            del user['password']

        #add user to the table
        error, result = execute_query(
            "INSERT INTO user (email, name, password) VALUES (%s, %s, %s)" , (user['email'], user['name'], hashed_password)
        )

        #handle errors
        if error:
            return {"error" : result}
        
        return(user)
            
    return {"error" : "Missing one or more fields!"}