from flask import Blueprint, request, Flask, jsonify, make_response, session, send_file
from .authentication import isAuthorized, isAuthorizedAdmin
from typing import Optional
import requests
from pymysql import err
#from .sqlsetup import execute_query
import mysql.connector
from .post import create_table, openAPI_info

jupyter_note_url = "http://127.0.0.1:8000/drawtable"
api_key = "bb900e932e83b1b8f2d17709f9d801e5"
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

bp = Blueprint('/gets', __name__)
cities = ['Corvallis', 'Salem', 'Portland', 'Eugene', 'Bend', 'Beaverton', 'Hillsboro', 'Gresham', 'Lake Oswego', 'Tigard', 'Grants Pass', 'Oregon City', 'Roseburg', 'Hood River']

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
    

# 모든 테이블을 업데이트한다.
@bp.route('/update-database', methods = ['GET'])
def update_cities():
    for city in cities:
        city_info = openAPI_info(city)
        
        #print(city_info)
        lat = city_info["city"]["coord"]["lat"]
        lon = city_info["city"]["coord"]["lon"]
        
        create_table(city, city_info)
    
    return jsonify({"msg": "DataBase Updated"})


# 업데이트 버튼을 누르면 마커를 위한 lat, lon을 보냄
@bp.route('/update-table', methods=['GET'])
def tables():
    cities_info = {}
    with conn.cursor() as cursor:
        for city in cities:
            try:
                # capstone.cities 테이블에서 위도와 경도를 선택하고 도시 이름을 조건으로 추가
                query = "SELECT lat, lon FROM capstone.cities WHERE city_name = %s;"
                cursor.execute(query, (city,))
                result = cursor.fetchone()
                print(result)
                if result:
                    cities_info[city] = {
                        'lat': result[0],
                        'lon': result[1]
                    }
                else:
                    cities_info[city] = {
                        'error': 'No data found'
                    }
            except Exception as e:
                print(f"Error fetching data for {city}: {e}")
                cities_info[city] = {
                    'error': str(e)
                }
    return jsonify({"cities_info": cities_info})
    

def create_table(city_name, city_info,):
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

@bp.route('/rain', methods= ['GET'])
def precip_graphs():
    global city_images_table  # 전역 변수로 사용
    response = requests.get(drawprecip_url, verify = False)
    city_images_table = response.json()
    return city_images_table