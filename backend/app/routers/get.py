from fastapi import FastAPI, APIRouter, Request
import requests
import json

router = APIRouter()

@router.get('/')
async def root():
    return {'main': 'this is the main route'}

@router.get('/test')
async def test():
    print("GET ")
    return {'test': 'this is a tesst'}
    

    