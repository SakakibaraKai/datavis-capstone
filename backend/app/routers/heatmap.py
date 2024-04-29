from math import radians, sin, cos, sqrt, atan2
from concurrent.futures import ThreadPoolExecutor
import folium
import requests
import json
from flask import jsonify

R = 6371.0
Standard_Distance = 223

def distance_from_A_B(lat1, lon1, lat2, lon2):
    # 지구의 반지름 (단위: km)
    R = 6371.0

    # 위도와 경도를 라디안 단위로 변환
    lat1 = radians(lat1)
    lon1 = radians(lon1)
    lat2 = radians(lat2)
    lon2 = radians(lon2)

    # Haversine 공식을 사용하여 거리 계산
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    distance = R * c

    return distance

def Over_Standard(lat1, lon1, lat2, lon2):
    # Hitmap
    if Standard_Distance <= distance_from_A_B(lat1, lon1, lat2, lon2):
        return True
    # Other Visualization
    else: 
        return False

def get_points(lat1, lon1, lat2, lon2, d):
    # 위도 및 경도 범위 설정
    min_lat = max(min(lat1, lat2), -90)
    max_lat = min(max(lat1, lat2), 90)
    min_lon = max(min(lon1, lon2), -180)
    max_lon = min(max(lon1, lon2), 180)
    
    # 중심 좌표 설정
    center_lat = round((min_lat + max_lat) / 2, 2)
    center_lon = round((min_lon + max_lon) / 2, 2)
    
    points = []

    top_left = (center_lat +2, center_lon -2)
    top_right = (center_lat + 2, center_lon + 2)
    bottom_left =(center_lat - 2, center_lon -2)
    bottom_right = (center_lat - 2, center_lon + 2)
    # 왼쪽 변 위의 점들
    #for lat in range(int(top_left[0]) * 100, int(bottom_left) 
    return points

def draw_map():
    pass
    


lat1, lon1 = 45.5051, -122.6750
lat2, lon2 = 47.6062, -122.3321

#distance_km = distance_from_A_B()
#print(distance_km)

# get_points 함수를 호출하여 점을 가져옵니다.
#l = get_points(lat1, lon1, lat2, lon2,  Standard_Distance)
#print(l)

# 결과 출력
#print("x 축에 대한 점:", x_axis)
#print("y 축에 대한 점:", y_axis)
#print("y=x 축에 대한 점:", y_x_axis)
#print("y=-x 축에 대한 점:", y__x_axis)
#print(l)
