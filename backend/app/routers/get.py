from fastapi import FastAPI, APIRouter

router = APIRouter()

@router.get('/test')
async def test():
    return {'test': 'this is a tesst'}