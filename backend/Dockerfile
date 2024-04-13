FROM python:3.12.2-slim

WORKDIR /server

COPY ./requirements.txt /server/requirements.txt

RUN pip install -r /server/requirements.txt

COPY ./app /server/app

EXPOSE 8080

CMD ["gunicorn", "app.server:app", "-b", "0.0.0.0:8080"]