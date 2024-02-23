from fastapi import FastAPI, APIRouter
from pydantic import BaseModel
from typing import Optional

#import requests
import json

router = APIRouter()

class DataJson(BaseModel):
    name: str
    type: str
    length: int

@router.post('/user/{user_id}')
async def create_user(user_id: int):
    return {'id': user_id}

@router.post('/datafetch')
async def fetch_data(req: dict):
    name = req.get("name")
    print(req['name'])
    print(name)

    return {
        "status": 200,
        "data": req
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

