from flask import Blueprint, request, Flask, jsonify, make_response, session
import requests
import json

bp = Blueprint('/gets', __name__)

@bp.route('/', methods = ['GET'])
def root():
    return {'main': 'this is the main route'}

@bp.route('/test', methods = ['GET'])
def test():
    print("GET ")
    return {'test': 'this is a tesst'}
    

    