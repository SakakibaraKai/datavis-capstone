from flask import Blueprint, request, Flask, jsonify, make_response, session
from typing import Optional
import requests
import json
import pymysql
import bcrypt
from pymysql import err
from .sqlsetup import execute_query
import uuid
import mysql.connector
from .authentication import createToken, validateToken, validatePassword, hashPassword
from math import radians, sin, cos, sqrt, atan2
from concurrent.futures import ProcessPoolExecutor
from .heatmap import get_points, distance_from_A_B, Over_Standard
import base64

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

R = 6371.0
Standard_Distance = 223

@bp.route('/users', methods = ['POST'])
def create_user(user_id: int):
    return {'id': user_id}

@bp.route('/validate', methods = ['POST'])
def validate():
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = str(auth_header.split(' ')[1])
        err, status = validateToken(token)
        if (err):
            return {"error" : "Not valid"}, 400
        return { "token", token }, 200
    return {"error" : "Not valid"}, 400
        

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

def create_table(city_name, city_info):
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

def get_table(city_name1, city_name2):
    data = {"city_name1": city_name1, "city_name2": city_name2}
    response = requests.post(drawtable_url, json=data, verify = False)
    return response.content

def get_heatmap(city_name1, city_name2):
    lat_1, lon_1 = get_lat_lon(city_name1)
    lat_2, lon_2 = get_lat_lon(city_name2)
    #center_lat = (lat_1 + lat_2) / 2
    #center_lon = (lon_1 + lon_2) / 2
    
    
    temp_data = openAPI_precip(get_points(lat_1, lon_1, lat_2, lon_2, distance_from_A_B(lat_1, lon_1, lat_2, lon_2)))
    data = {"precip": temp_data}
    print("==data: ", data)
    response = requests.post(heatmap_url, json=data, verify = False)
    return response.content

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
                
@bp.route('/create', methods= ['POST', 'GET'])
def create_graphs():
    if request.method == 'POST':
        content = request.get_json()
        city_name1 = content['city_name1']
        city_name2 = content['city_name2']
        
        city_info1 = openAPI_info(city_name1)
        city_info2 = openAPI_info(city_name2)
        
        # 두 개의 도시 테이블 생성
        create_table(city_name1, city_info1)
        create_table(city_name2, city_info2)
        
        # 그래프 얻어오기
        graphs = get_table(city_name1, city_name2)
        # graphs를 문자열로 디코딩하여 JSON 객체로 변환
        graphs_json = graphs.decode('utf-8')
        graphs_dict = json.loads(graphs_json)

        humidity_id = graphs_dict["humidity_img_id"]
        max_temp_id = graphs_dict["max_temp_img_id"]
        pressure_id = graphs_dict["pressure_img_id"]
        with conn.cursor() as cursor:
            cursor.execute(f"USE {rds_database}")
            # 각 이미지의 ID를 사용하여 쿼리 실행하여 이미지 데이터 가져오기
            cursor.execute(f"SELECT image_data FROM images WHERE id = %s", (humidity_id,))
            humidity_image_data = cursor.fetchone()
            #print(humidity_image_data)
            
            cursor.execute(f"SELECT image_data FROM images WHERE id = %s", (max_temp_id,))
            max_temp_image_data = cursor.fetchone()
            #print(max_temp_image_data)

            cursor.execute(f"SELECT image_data FROM images WHERE id = %s", (pressure_id,))
            pressure_image_data = cursor.fetchone()
            #print(pressure_image_data)

        res = {
            "humidity_image": humidity_image_data[0] if humidity_image_data else None,
            "max_temp_image": max_temp_image_data[0] if max_temp_image_data else None,
            "pressure_image": pressure_image_data[0] if pressure_image_data else None
        }

        return jsonify(res)
        
    if request.method == 'GET':
        city_name1 = 'Portland'
        city_name2 = 'Seattle'
        lat_1, lon_1 = get_lat_lon(city_name1)
        lat_2, lon_2 = get_lat_lon(city_name2)
        if Over_Standard(lat_1, lon_1, lat_2, lon_2) == True:
            data = get_heatmap(city_name1, city_name2)
            return jsonify({"msg": data})
        else:
            pass
        
        return graphs
'''
{
    "cityName": "Beaverton",
    "position": [45.4872, -122.8038]    
}

    '''    
        
@bp.route('/rain', methods= ['POST'])
def precip_graphs():
    if request.method == 'POST':
        content = request.get_json()
        response = requests.post(precip_url, json=content, verify = False)
        res_data = response.json()
        res_data_ids_str = ', '.join(map(str, res_data['ids']))
        
        image_data_dict = {}
        with conn.cursor() as cursor:
            cursor.execute(f"USE {rds_database}")
            # 각 이미지의 ID를 사용하여 쿼리 실행하여 이미지 데이터 가져오기
            cursor.execute(f"SELECT id, date, image_data, description FROM capstone.precip_images WHERE id IN ({res_data_ids_str})")
            results = cursor.fetchall()
            
            for i, row in enumerate(results):
                image_id = row[0]
                date = row[1]
                image_data = row[2]
                image_description = row[3]
                image_data_dict[f"image_{i+1}"] = {"date": date, "description": image_description, "image_data": image_data}
        
        return jsonify(image_data_dict)
