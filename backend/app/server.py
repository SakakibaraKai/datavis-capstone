from fastapi import FastAPI, APIRouter
from .routers import post, get
import uvicorn

app = FastAPI()

app.include_router(get.router)
app.include_router(post.router)

#if __name__ == "__main__":
#    uvicorn.run(app, host="0.0.0.0", port=8080)