
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const API_INSCRIPCIONES = `${API_URL}/api/inscripciones`;

export const fetchInscripciones = async () => {
  const respuesta = await axios.get(API_INSCRIPCIONES);
  return respuesta.data;
};

export const fetchInscripcion = async (id) => {
  const respuesta = await axios.get(`${API_INSCRIPCIONES}/${id}`);
  return respuesta.data;
};

export const createInscripcion = async (inscripcion) => {
  const respuesta = await axios.post(API_INSCRIPCIONES, inscripcion);
  return respuesta.data;
};

export const updateInscripcion = async (id, inscripcion) => {
  const respuesta = await axios.put(
    `${API_INSCRIPCIONES}/${id}`,
    inscripcion
  );
  return respuesta.data;
};

export const deleteInscripcion = async (id) => {
  const respuesta = await axios.delete(`${API_INSCRIPCIONES}/${id}`);
  return respuesta.data;
};
