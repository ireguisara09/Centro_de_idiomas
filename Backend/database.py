from decouple import config
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = config("MONGO_URL")
DATABASE_NAME = config("DATABASE_NAME", default="centro_idiomas")

cliente = AsyncIOMotorClient(MONGO_URL)

database = cliente[DATABASE_NAME]

coleccion = database["inscripciones"]


async def crear_indices():
    await coleccion.create_index(
        [
            ("estudiante_normalizado", 1),
            ("idioma_nivel_normalizado", 1)
        ],
        unique=True,
        name="estudiante_idioma_nivel_unico",
        partialFilterExpression={
            "estudiante_normalizado": {"$type": "string"},
            "idioma_nivel_normalizado": {"$type": "string"}
        }
    )
