FROM python:3.12.2-slim

RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    make \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /server

COPY ./requirements.txt /server/requirements.txt

RUN pip install -r /server/requirements.txt

COPY ./app /server/app

EXPOSE 8080

CMD ["gunicorn", "app.server:app", "-b", "0.0.0.0:8080", "--timeout", "300"]
