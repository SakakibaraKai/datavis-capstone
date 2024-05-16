import numpy as np
import matplotlib.pyplot as plt
import datetime

# 캘빈을 화씨로 변환하는 함수
def kelvin_to_fahrenheit(kelvin):
    celsius = kelvin - 273.15
    fahrenheit = celsius * 9/5 + 32
    return round(fahrenheit, 2)

def draw_daily_temp(formatted_data):
    # 요일 설정
    times = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00']
    
    # 데이터 분리
    times_dict = {}
    dates = [d[0] for d in formatted_data]
    temperatures = [d[1] for d in formatted_data]

    # 완벽한 시간대가 있는 날짜들을 저장할 리스트
    complete_dates = []
    # 모든 날짜에 대해 반복
    for date_data in formatted_data:
        date = date_data[0].date()  # 날짜 정보만 추출
        time = date_data[0].strftime('%H:%M')  # 시간 정보만 추출
        
        if time == '00:00':
            
            # 새로운 날짜인 경우, 해당 날짜가 완벽한 시간대를 가지고 있는지 확인
            complete_time_found = all((datetime.datetime.combine(date, datetime.time.fromisoformat(t)) in [d[0] for d in formatted_data] for t in times))
            
            if complete_time_found:
                # 완벽한 시간대가 있는 경우, 해당 날짜를 리스트에 추가
                complete_dates.append(date)

    print(complete_dates)
    # 각 날짜에 대한 온도 리스트 생성
    temperature_dict = {}
    for date in complete_dates:
        # 해당 날짜의 온도 리스트 생성
        temperatures = [kelvin_to_fahrenheit(data[1]) for data in formatted_data if data[0].date() == date]
        # 해당 날짜를 '일자' 포맷에 맞게 문자열로 변환하여 딕셔너리에 저장
        date_string = date.strftime('%dth')
        temperature_dict[date_string] = temperatures

    # Color
    colors = ['blue', 'purple', 'red', 'green', 'green', 'brown']
    
    # 레이더 차트 그리기
    categories = list(temperature_dict.keys())
    values = [temperature_dict[key] for key in categories]

    # 각 카테고리에 대해 레이더 차트 그리기
    angles = np.linspace(0, 2 * np.pi, len(times), endpoint=False).tolist()
    fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(polar=True))

    # 각 카테고리에 대해 채우기
    for i, category in enumerate(categories):
        ax.fill(angles, values[i], color= colors[i], alpha=0.25, label=category)

    ax.set_yticklabels([])
    ax.set_thetagrids(np.linspace(0, 360, len(times), endpoint=False), times)
    ax.set_title('Time Weather', size=20, color='black', y=1.1)

    plt.legend(loc='upper left', fontsize='medium')
    plt.show()

# 예시 데이터
formatted_data = [(datetime.datetime(2024, 5, 13, 12, 0), 283.66, 1017.0, 89.0), (datetime.datetime(2024, 5, 13, 15, 0), 285.5, 1018.0, 83.0), (datetime.datetime(2024, 5, 13, 18, 0), 290.95, 1019.0, 64.0), (datetime.datetime(2024, 5, 13, 21, 0), 294.26, 1017.0, 52.0), (datetime.datetime(2024, 5, 14, 0, 0), 293.81, 1016.0, 55.0), (datetime.datetime(2024, 5, 14, 3, 0), 287.32, 1017.0, 73.0), (datetime.datetime(2024, 5, 14, 6, 0), 282.43, 1020.0, 86.0), (datetime.datetime(2024, 5, 14, 9, 0), 280.75, 1020.0, 94.0), (datetime.datetime(2024, 5, 14, 12, 0), 279.4, 1021.0, 97.0), (datetime.datetime(2024, 5, 14, 15, 0), 283.05, 1021.0, 81.0), (datetime.datetime(2024, 5, 14, 18, 0), 288.35, 1021.0, 66.0), (datetime.datetime(2024, 5, 14, 21, 0), 292.8, 1019.0, 55.0), (datetime.datetime(2024, 5, 15, 0, 0), 295.33, 1018.0, 51.0), (datetime.datetime(2024, 5, 15, 3, 0), 289.09, 1018.0, 74.0), (datetime.datetime(2024, 5, 15, 6, 0), 283.23, 1020.0, 86.0), (datetime.datetime(2024, 5, 15, 9, 0), 281.02, 1020.0, 94.0), (datetime.datetime(2024, 5, 15, 12, 0), 280.06, 1020.0, 94.0), (datetime.datetime(2024, 5, 15, 15, 0), 284.44, 1021.0, 78.0), (datetime.datetime(2024, 5, 15, 18, 0), 290.03, 1020.0, 65.0), (datetime.datetime(2024, 5, 15, 21, 0), 294.22, 1018.0, 59.0), (datetime.datetime(2024, 5, 16, 0, 0), 296.22, 1016.0, 57.0), (datetime.datetime(2024, 5, 16, 3, 0), 291.45, 1016.0, 80.0), (datetime.datetime(2024, 5, 16, 6, 0), 285.12, 1017.0, 89.0), (datetime.datetime(2024, 5, 16, 9, 0), 282.97, 1017.0, 94.0), (datetime.datetime(2024, 5, 16, 12, 0), 281.7, 1018.0, 95.0), (datetime.datetime(2024, 5, 16, 15, 0), 285.86, 1018.0, 82.0), (datetime.datetime(2024, 5, 16, 18, 0), 291.88, 1018.0, 63.0), (datetime.datetime(2024, 5, 16, 21, 0), 295.32, 1016.0, 55.0), (datetime.datetime(2024, 5, 17, 0, 0), 297.17, 1014.0, 54.0), (datetime.datetime(2024, 5, 17, 3, 0), 289.87, 1015.0, 76.0), (datetime.datetime(2024, 5, 17, 6, 0), 284.22, 1017.0, 90.0), (datetime.datetime(2024, 5, 17, 9, 0), 282.38, 1017.0, 96.0), (datetime.datetime(2024, 5, 17, 12, 0), 281.25, 1017.0, 98.0), (datetime.datetime(2024, 5, 17, 15, 0), 284.74, 1018.0, 87.0), (datetime.datetime(2024, 5, 17, 18, 0), 288.2, 1018.0, 68.0), (datetime.datetime(2024, 5, 17, 21, 0), 292.47, 1017.0, 46.0), (datetime.datetime(2024, 5, 18, 0, 0), 291.76, 1016.0, 48.0), (datetime.datetime(2024, 5, 18, 3, 0), 284.87, 1018.0, 64.0), (datetime.datetime(2024, 5, 18, 6, 0), 279.35, 1021.0, 84.0), (datetime.datetime(2024, 5, 18, 9, 0), 277.36, 1021.0, 93.0)]

draw_daily_temp(formatted_data)