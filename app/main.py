from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.database import create_db_and_tables
from app.routers import tasks, auth

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(
    title="Task Manager API",
    description="REST API para gestión de tareas con autenticación JWT",
    version="1.0.0",
    lifespan=lifespan
)

app.include_router(auth.router)
app.include_router(tasks.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}
