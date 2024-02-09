FROM python:3.12.2-slim

WORKDIR /server

COPY ./requirements.txt /server/requirements.txt

RUN pip install -r /server/requirements.txt

COPY ./app /server/app

CMD ["uvicorn", "app.server:app", "--host", "0.0.0.0", "--port", "80"]