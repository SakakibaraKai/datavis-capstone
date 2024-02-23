from fastapi import FastAPI, APIRouter
from .routers import post, get
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origin to access to port : 8080
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

app.include_router(get.router)
app.include_router(post.router)

#if __name__ == "__main__":
#    uvicorn.run(app, host="0.0.0.0", port=8080)