
from bson import ObjectId
from pymongo.errors import DuplicateKeyError
from fastapi import APIRouter, HTTPException
from normalizar import normalizar_texto

from database import coleccion
from models import (
    InscripcionCreate,
    InscripcionUpdate,
    InscripcionResponse
)

router = APIRouter(
    prefix="/api/inscripciones",
    tags=["Inscripciones"]
)


def convertir_inscripcion(documento: dict) -> dict:
    return {
        "id": str(documento["_id"]),
        "estudiante": documento["estudiante"],
        "idioma_nivel": documento["idioma_nivel"],
        "costo_modulo": documento["costo_modulo"],
        "matriculado": documento["matriculado"]
    }


def validar_id(id: str) -> ObjectId:
    if not ObjectId.is_valid(id):
        raise HTTPException(
            status_code=400,
            detail="El identificador no tiene un formato válido"
        )

    return ObjectId(id)


async def buscar_inscripcion_duplicada(
    estudiante: str,
    idioma_nivel: str,
    excluir_id: ObjectId | None = None
):
    estudiante_normalizado = normalizar_texto(estudiante)
    idioma_nivel_normalizado = normalizar_texto(idioma_nivel)

    documentos = await coleccion.find(
        {},
        {
            "estudiante": 1,
            "idioma_nivel": 1
        }
    ).to_list(length=None)

    for documento in documentos:
        if excluir_id is not None and documento["_id"] == excluir_id:
            continue

        nombre_existente = normalizar_texto(documento["estudiante"])
        idioma_existente = normalizar_texto(documento["idioma_nivel"])

        if (
            nombre_existente == estudiante_normalizado
            and idioma_existente == idioma_nivel_normalizado
        ):
            return documento

    return None


@router.get("", response_model=list[InscripcionResponse])
async def listar_inscripciones():
    documentos = await coleccion.find().to_list(length=1000)

    return [
        convertir_inscripcion(documento)
        for documento in documentos
    ]


@router.get("/{id}", response_model=InscripcionResponse)
async def obtener_inscripcion(id: str):
    object_id = validar_id(id)

    documento = await coleccion.find_one({"_id": object_id})

    if documento is None:
        raise HTTPException(
            status_code=404,
            detail="Inscripción no encontrada"
        )

    return convertir_inscripcion(documento)


@router.post(
    "",
    response_model=InscripcionResponse,
    status_code=201
)
async def crear_inscripcion(inscripcion: InscripcionCreate):
    datos = inscripcion.model_dump()

    duplicada = await buscar_inscripcion_duplicada(
        datos["estudiante"],
        datos["idioma_nivel"]
    )

    if duplicada:
        raise HTTPException(
            status_code=409,
            detail="Este estudiante ya tiene una inscripción registrada para este idioma y nivel."
        )

    datos["estudiante_normalizado"] = normalizar_texto(
        datos["estudiante"]
    )
    datos["idioma_nivel_normalizado"] = normalizar_texto(
        datos["idioma_nivel"]
    )

    try:
        resultado = await coleccion.insert_one(datos)
    except DuplicateKeyError:
        raise HTTPException(
            status_code=409,
            detail="Este estudiante ya tiene una inscripción registrada para este idioma y nivel."
        )

    documento = await coleccion.find_one({
        "_id": resultado.inserted_id
    })

    return convertir_inscripcion(documento)


@router.put("/{id}", response_model=InscripcionResponse)
async def actualizar_inscripcion(
    id: str,
    inscripcion: InscripcionUpdate
):
    object_id = validar_id(id)

    actual = await coleccion.find_one({"_id": object_id})

    if actual is None:
        raise HTTPException(
            status_code=404,
            detail="Inscripción no encontrada"
        )

    cambios = inscripcion.model_dump(exclude_unset=True)

    datos_finales = {
        "estudiante": cambios.get("estudiante", actual["estudiante"]),
        "idioma_nivel": cambios.get(
            "idioma_nivel",
            actual["idioma_nivel"]
        )
    }

    duplicada = await buscar_inscripcion_duplicada(
        datos_finales["estudiante"],
        datos_finales["idioma_nivel"],
        excluir_id=object_id
    )

    if duplicada:
        raise HTTPException(
            status_code=409,
            detail="Ya existe una inscripción para este estudiante, idioma y nivel."
        )

    cambios["estudiante_normalizado"] = normalizar_texto(
        datos_finales["estudiante"]
    )
    cambios["idioma_nivel_normalizado"] = normalizar_texto(
        datos_finales["idioma_nivel"]
    )

    try:
        await coleccion.update_one(
            {"_id": object_id},
            {"$set": cambios}
        )
    except DuplicateKeyError:
        raise HTTPException(
            status_code=409,
            detail="Ya existe una inscripción para este estudiante, idioma y nivel."
        )

    documento = await coleccion.find_one({"_id": object_id})

    return convertir_inscripcion(documento)


@router.delete("/{id}")
async def eliminar_inscripcion(id: str):
    object_id = validar_id(id)

    resultado = await coleccion.delete_one({"_id": object_id})

    if resultado.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Inscripción no encontrada"
        )

    return {
        "message": "Inscripción eliminada correctamente"
    }
