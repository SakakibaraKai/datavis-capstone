from fastapi import FastAPI, APIRouter
from .routers import post, get

app = FastAPI()

app.include_router(get.router)
app.include_router(post.router)

@app.get('/')
async def root():
    return {'main': 'this is the main route'}