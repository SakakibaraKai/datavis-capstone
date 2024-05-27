from flask import Blueprint, request, Flask, jsonify, make_response, session
from typing import Optional
import requests
import json
import pymysql
from pymysql import err
from .sqlsetup import execute_query
import mysql.connector
from .authentication import createToken, validateToken, validatePassword, hashPassword, isAuthorized, isAuthorizedAdmin
from math import radians, sin, cos, sqrt, atan2
from concurrent.futures import ProcessPoolExecutor
from functools import wraps
import time

session = requests.session()

bp = Blueprint('posts', __name__ )
api_key = "bb900e932e83b1b8f2d17709f9d801e5"

jupyter_note_host = "host.docker.internal"
jupyter_note_port = 8000
drawtable_url = f"http://{jupyter_note_host}:{jupyter_note_port}/drawtable"
drawheatmap_url = f"http://{jupyter_note_host}:{jupyter_note_port}/drawheatmap"
drawprecip_url = f"http://{jupyter_note_host}:{jupyter_note_port}/drawprecip"
table_url = "http://localhost:8000/drawtable"
heatmap_url = "http://localhost:8000/drawheatmap"
precip_url = "http://localhost:8000/drawprecip"
pychart_url = "http://localhost:8000/drawpychart"
hurl = "http://172.17.0.2:8000/drawtable"

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

city_images_table = {
    "Corvallis": [],
    "Salem": [],
    "Portland": [],
    "Eugene": [],
    "Bend": [],
    "Beaverton": [],
    "Hillsboro": [],
    "Gresham": [],
    "Lake Oswego": [],
    "Tigard": [],
    "Grants Pass": [],
    "Oregon City": [],
    "Roseburg": [],
    "Hood River": []
}

def get_db_connection():
    return pymysql.connect(
        host=rds_host,
        port=rds_port,
        user=rds_user,
        password=rds_password,
        database=rds_database,
        cursorclass=pymysql.cursors.DictCursor
    )

 
@bp.route('/validate', methods = ['POST'])
@isAuthorized
def validate():
    return { "token" : request.headers.get('Authorization').split(' ')[1] }, 200


@bp.route('/login', methods = ['POST'])
def login():
    user = json.loads(request.data)
    if "password" in user and "email" in user:
        query_data = execute_query(
            "SELECT name, password, id, is_admin FROM user WHERE email = %s"
        , (user['email']))
        #0 - Name. 1- Password
        err, message, status = validatePassword(user['password'].encode('utf-8'), query_data[0][1].encode('utf-8'), query_data[0][2], query_data[0][0], query_data[0][3])
        if err:
            return {"error": message}, status
        return{"token": message}, status
        
    return {"error" : "Missing one or more fields!"}, 400

@bp.route('/register', methods = ['POST'])
@isAuthorizedAdmin
def register():
    user = json.loads(request.data)
    if "name" in user and "password" in user and "email" and "is_admin" in user:
        #encrypt password for storage
        hashed_password = hashPassword(user["password"].encode('utf-8'))
        #delete password so we can send the user back
        if 'password' in user:
            del user['password']

        #add user to the table
        error, result = execute_query(
            "INSERT INTO user (email, name, password, is_admin) VALUES (%s, %s, %s, %s)" , (user['email'], user['name'], hashed_password, user['is_admin'])
        )
        #handle errors
        if error:
            return {"error" : result}, 400
        return(user)
            
    return {"error" : "Missing one or more fields!"}, 400

def create_table(city_name, city_info):
    col1 = "date"
    col2 = "time"
    col3 = "maximum_temperature"
    col4 = "lowest_temperature"
    col5 = "pop"
    col6 = "pressure"
    col7 = "humidity"
    col8 = "description"
    col9 = "lat"
    col10 = "lon"
    try:
        with conn.cursor() as cursor:
            # DB selection
            cursor.execute(f"USE {rds_database}")
            # If table exists, drop it
            cursor.execute(f"DROP TABLE IF EXISTS `{city_name}`")
            # table query creation
            sql = f"CREATE TABLE IF NOT EXISTS `{city_name}` ("
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
            for data in city_info['list']:
                dt_txt = data['dt_txt']
                date, time = dt_txt.split()
                max_temp = data['main']['temp_max']
                min_temp = data['main']['temp_min']
                pop = data['pop']
                pressure = data['main']['pressure']
                humidity = data['main']['humidity']
                description = data['weather'][0]['description']
                #print("==",date, time, max_temp, min_temp, pop, pressure, humidity, description)

                # 쿼리 작성 및 실행
                insert_sql = f"INSERT INTO `{city_name}` ({col1}, {col2}, {col3}, {col4}, {col5}, {col6}, {col7}, {col8}) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
                cursor.execute(insert_sql, (date, time, max_temp, min_temp, pop, pressure, humidity, description))
                conn.commit()

            print(f"Table '{city_name}' has been created successfully.")

    except Exception as e:
        # Error
        print("Error::", e)
    finally:
        return jsonify({"message": "Table successfully created"})

# 리스트 형식으로 반환
def get_lat_lon(city_name):
    url = f"https://api.openweathermap.org/geo/1.0/direct?q={city_name}&limit=1&appid={api_key}"
    response = requests.get(url)
    response.raise_for_status()
    data = response.json()
    
    lat = data[0]['lat']
    lon = data[0]['lon']

    return lat, lon

def openAPI_info(city_name):
    url_1 = f"https://api.openweathermap.org/geo/1.0/direct?q={city_name}&limit=5&appid={api_key}"
    response_1 = requests.get(url_1)
    response_1.raise_for_status()
    data_1 = response_1.json()
    # 위도 및 경도 추출
    lat = data_1[0]['lat']
    lon = data_1[0]['lon']
    print("==city_name: ", city_name, "==lat: ", lat, "==lon: ", lon)
    # 두 번째 API 호출
    url_2 = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={api_key}"
    response_2 = requests.get(url_2)
    response_2.raise_for_status()  # 오류가 발생하면 예외를 발생시킵니다.
    data_2 = response_2.json()
    return data_2

def get_precip(lat, lon):
    url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={api_key}"
    res = requests.get(url)
    res.raise_for_status()
    pop = res.json()['list'][0]['pop']
    return lat, lon, pop

def openAPI_precip(li):
    precip = []
    with ProcessPoolExecutor(max_workers=4) as executor:
        results = executor.map(get_precip, [lat for lat, _ in li], [lon for _, lon in li])
    
    for result in results:
        lat, lon, pop = result
        if pop >= 0.2:
            precip.append([lat, lon, pop])

    return precip
                
def get_table(city_name1, city_name2):
    data = {"city_name1": city_name1, "city_name2": city_name2}
    response = requests.post(drawtable_url, json=data, verify = False)
    return response.content

@bp.route('/create', methods= ['POST', 'GET'])
def create_graphs():
    if request.method == 'POST':
        content = request.get_json()
        city_name1 = content['city_name1']
        city_name2 = content['city_name2']

        # 그래프 얻어오기
        graphs = get_table(city_name1, city_name2)
        # graphs를 문자열로 디코딩하여 JSON 객체로 변환
        graphs_json = graphs.decode('utf-8')
        res = json.loads(graphs_json)
        print(res["id"])
        image_id = res["id"]
        
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Could not connect to the database"}), 500
        
        with conn.cursor() as cursor:
            cursor.execute(f"USE {rds_database}")

            # 데이터 저장 완료 확인
            attempts = 0
            max_attempts = 5
            while attempts < max_attempts:
                cursor.execute("SELECT max_temp_img, min_temp_img, humidity_img, pressure_img FROM images WHERE id = %s", (image_id,))
                image_data = cursor.fetchall()
                print(f"Attempt {attempts + 1}: Fetched image data: {image_data}")
                if image_data:
                    break
                time.sleep(1)
                attempts += 1

            if not image_data:
                return jsonify({"error": "No image data found"}), 404

            image = {
                "max_temp_img": image_data[0]['max_temp_img'],
                "min_temp_img": image_data[0]['min_temp_img'],
                "humidity_img": image_data[0]['humidity_img'],
                "pressure_img": image_data[0]['pressure_img']
            }
            return jsonify(image)

@bp.route('/bringgraphs', methods = ['POST'])
def bring_graphs():
    if request.method == 'POST':
        content = request.get_json()
        city_name = content['cityName']
        table_name = f"{city_name}_images"  # 테이블 이름을 동적으로 구성
        print(table_name)
        image_data_dict = {}
        ids = city_images_table.get(city_name, [])
        ids_str = ', '.join(map(str, ids))
        print(ids)
        with conn.cursor() as cursor:
            cursor.execute(f"""
                SELECT id, date, image_data1, image_data2, description, precipitation, humidity, temperature 
                FROM `{table_name}`
                WHERE id IN ({ids_str})
            """)
            results = cursor.fetchall()
            for i, row in enumerate(results):
                date = row[1]
                image_data1 = row[2]
                image_data2 = row[3]
                image_description = row[4]
                precipitation = row[5]
                humidity = row[6]
                temperature = row[7]
                image_data_dict[f"image_{i+1}"] = {"date": date, "description": image_description, "image_data1": image_data1, "image_data2": image_data2, "image_data" "humidity": humidity, "precipitation": precipitation, "temperature": temperature}
        
        return jsonify(image_data_dict)
        
@bp.route('/city-tables', methods = ['GET'])
def city_tables():
    return city_images_table