FROM jupyter/scipy-notebook:latest

# 추가 라이브러리 설치 (선택사항)
RUN pip install pandas numpy matplotlib seaborn scikit-learn Flask flask-cors requests pymysql CORS

# 사용자 코드 및 폴더 구조 복사
COPY ./code /home/jovyan/work

# 사용자 코드 및 폴더 구조의 권한 변경
USER root
RUN chmod -R 777 /home/jovyan/work
USER jovyan

# 포트 열기
EXPOSE 8888
EXPOSE 8000

#CMD ["jupyter", "notebook", "--ip=0.0.0.0", "--port=8888", "--allow-root", "&", "python", "/home/jovyan/work/app.py"]
# Flask 애플리케이션 실행 (선택사항)
