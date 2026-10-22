import unicodedata


def normalizar_texto(texto: str) -> str:
    texto = " ".join(texto.strip().split()).casefold()
    texto = unicodedata.normalize("NFD", texto)

    texto = "".join(
        caracter
        for caracter in texto
        if unicodedata.category(caracter) != "Mn"
    )

    return texto
