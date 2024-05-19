#from app.routers import post, get, delete, put
from routers import post, get
from flask import Flask, render_template, session
from dotenv import load_dotenv, find_dotenv
from os import environ as env
from flask_cors import CORS

app = Flask(__name__)
app.register_blueprint(get.bp)
app.register_blueprint(post.bp)

CORS(app, resources={r"/*": {"origins": "*"}})

ENV_FILE = find_dotenv("APP_SECRET_KEY")
if ENV_FILE:
    load_dotenv(ENV_FILE)

app.secret_key = env.get("APP_SECRET_KEY")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
    #app.run(debug=True)