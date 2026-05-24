from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from app.dataloader import create_dataloaders
from dotenv import load_dotenv
from fastapi import Depends
import os

load_dotenv()

engine = create_async_engine(
    os.getenv("DATABASE_URL"),
    echo=True
)

AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

class Base(DeclarativeBase):
    pass

async def get_session():
    async with AsyncSessionLocal() as session:
        yield session

async def get_context(session: AsyncSession = Depends(get_session)):
    return {
        "session": session,
        "dataloaders": create_dataloaders(session),
    }