from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.resolvers import graphql_app

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(graphql_app, prefix="/graphql")