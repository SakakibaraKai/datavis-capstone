FROM jupyter/datascience-notebook

# 빌드 종속성 설치 (Ubuntu/Debian 예시)
RUN apt-get update && apt-get install -y --no-cache gnupg2
RUN echo "deb http://deb.debian.org/debian buster-backports main" | tee -a /etc/apt/sources.list.d/backports.list
RUN apt-get update && apt-get install -y --no-cache build-essential python3-dev

# requirements.txt 파일에서 추가 Python 패키지 설치
COPY requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt

# Jupyter Notebook 서버용 포트 8888 개방
EXPOSE 8888

# drawdata.ipynb 파일을 컨테이너에 복사
COPY drawdata.ipynb /home/jovyan/

# nbconvert를 사용하여 노트북을 HTML로 변환하는 명령 설정
CMD ["jupyter", "nbconvert", "--to", "html", "/home/jovyan/drawdata.ipynb"]