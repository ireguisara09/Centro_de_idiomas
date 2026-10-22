from pydantic import BaseModel, Field, ConfigDict, field_validator


class InscripcionCreate(BaseModel):
    estudiante: str = Field(min_length=2, max_length=100)
    idioma_nivel: str = Field(min_length=2, max_length=100)
    costo_modulo: float = Field(gt=0)
    matriculado: bool = True

    @field_validator("estudiante", "idioma_nivel")
    @classmethod
    def validar_texto(cls, valor: str) -> str:
        valor = valor.strip()

        if not valor:
            raise ValueError("El campo no puede estar vacío")

        return valor


class InscripcionUpdate(InscripcionCreate):
    pass


class InscripcionResponse(InscripcionCreate):
    id: str

    model_config = ConfigDict(extra="ignore")

