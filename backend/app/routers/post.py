from fastapi import FastAPI, APIRouter

router = APIRouter()

@router.post('/user/{user_id}')
async def create_user(user_id: int):
    return {'id': user_id}