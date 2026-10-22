from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import cliente
from Router.inscripciones import router as inscripciones_router

from database import cliente, crear_indices


@asynccontextmanager
async def lifespan(app: FastAPI):
    await cliente.admin.command("ping")
    yield
    cliente.close()
    await cliente.admin.command("ping")
    await crear_indices()


app = FastAPI(
    title="API Centro de Idiomas",
    description="Sistema de inscripción a cursos de idiomas",
    version="1.0.0",
    lifespan=lifespan
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
async def welcome():
    return {
        "message": "Bienvenido a la API del Centro de Idiomas"
    }


app.include_router(inscripciones_router)
