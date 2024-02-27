from flask import Blueprint, request, Flask, jsonify, make_response, session
from typing import Optional
import requests
import json

bp = Blueprint('posts', __name__ )

@bp.route('/users', methods = ['POST'])
def create_user(user_id: int):
    return {'id': user_id}

@bp.route('/datafetch', methods = ['POST'])
def fetch_data():
    content = request.get_json()
    if content:
        print("Successfully POST request was sent from frontend!")
    else:
        print("failed to POST request")
    
    return {
        "status": 200,
        "data": content
    }


'''
# if the item is not a stuff in our list
@router.post("/datafetch/plus")
async def create_item(item_id: int, item: DataJson):
    print(item_id)
    print(item)

# Request Body + Path Parameters + Query Parameters
@app.post("/items/plus/query/{item_id}")
async def create_item_query(item_id: int, item: DataJson, q: Optional[str] = None):
    result = {
        "item_id": item_id,
        **item.dict(),
    }

    if q:
        result.update({"q": q})

    return {
            "status": 200,
            "data": result,
    }

'''

