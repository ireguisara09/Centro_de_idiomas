
import { useEffect, useState } from "react";
import {
  BookOpen,
  GraduationCap,
  Users,
  UserPlus,
  Pencil,
  Trash2,
  Search,
  X,
  Save,
  RefreshCw,
  CheckCircle2,
  CircleAlert,
  LoaderCircle,
} from "lucide-react";
import {
  fetchInscripciones,
  createInscripcion,
  updateInscripcion,
  deleteInscripcion,
} from "../api/inscripciones";

const formularioInicial = {
  estudiante: "",
  idioma_nivel: "",
  costo_modulo: "",
  matriculado: true,
};

function Inscripciones() {
  const [inscripciones, setInscripciones] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [idEdicion, setIdEdicion] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("success");

  const cargarInscripciones = async () => {
    setCargando(true);

    try {
      const datos = await fetchInscripciones();

      if (!Array.isArray(datos)) {
        console.error("Respuesta inesperada de la API:", datos);
        throw new Error("La API no devolvió una lista de inscripciones.");
      }

      setInscripciones(datos);
      setMensaje("");
    } catch (error) {
      console.error("Error al cargar inscripciones:", error);
      setTipoMensaje("error");
      setMensaje(
        error.response?.data?.detail ||
          error.message ||
          "No fue posible cargar las inscripciones. Verifica que el backend esté funcionando."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarInscripciones();
  }, []);

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const limpiarFormulario = () => {
    setFormulario({ ...formularioInicial });
    setIdEdicion(null);
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setMensaje("");

    const datos = {
      estudiante: formulario.estudiante.trim(),
      idioma_nivel: formulario.idioma_nivel.trim(),
      costo_modulo: Number(formulario.costo_modulo),
      matriculado: formulario.matriculado,
    };

    if (
      !datos.estudiante ||
      !datos.idioma_nivel ||
      formulario.costo_modulo === "" ||
      !Number.isFinite(datos.costo_modulo) ||
      datos.costo_modulo <= 0
    ) {
      setTipoMensaje("error");
      setMensaje(
        "Completa todos los campos y verifica que el costo sea mayor que cero."
      );
      return;
    }

    setGuardando(true);

    try {
      if (idEdicion) {
        await updateInscripcion(idEdicion, datos);
        setTipoMensaje("success");
        setMensaje("La inscripción se actualizó correctamente.");
      } else {
        await createInscripcion(datos);
        setTipoMensaje("success");
        setMensaje("La inscripción se registró correctamente.");
      }

      limpiarFormulario();
      await cargarInscripciones();
    } catch (error) {
      console.error("Error al guardar la inscripción:", error);
      setTipoMensaje("error");
      setMensaje(
        error.response?.data?.detail ||
          "No fue posible guardar la inscripción. Verifica la conexión con el servidor."
      );
    } finally {
      setGuardando(false);
    }
  };

  const manejarEdicion = (inscripcion) => {
    setIdEdicion(inscripcion.id);
    setFormulario({
      estudiante: inscripcion.estudiante,
      idioma_nivel: inscripcion.idioma_nivel,
      costo_modulo: String(inscripcion.costo_modulo),
      matriculado: inscripcion.matriculado,
    });
    setMensaje("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const manejarEliminacion = async (inscripcion) => {
    const confirmar = window.confirm(
      `¿Deseas eliminar la inscripción de ${inscripcion.estudiante}?`
    );

    if (!confirmar) return;

    setMensaje("");

    try {
      await deleteInscripcion(inscripcion.id);

      if (idEdicion === inscripcion.id) {
        limpiarFormulario();
      }

      setTipoMensaje("success");
      setMensaje("La inscripción se eliminó correctamente.");
      await cargarInscripciones();
    } catch (error) {
      console.error("Error al eliminar la inscripción:", error);
      setTipoMensaje("error");
      setMensaje(
        error.response?.data?.detail ||
          "No fue posible eliminar la inscripción."
      );
    }
  };

  const listaInscripciones = Array.isArray(inscripciones)
    ? inscripciones
    : [];

  const textoBusqueda = busqueda.trim().toLowerCase();

  const inscripcionesFiltradas = listaInscripciones.filter(
    (inscripcion) => {
      const estudiante = String(inscripcion.estudiante ?? "").toLowerCase();
      const idioma = String(inscripcion.idioma_nivel ?? "").toLowerCase();

      return (
        estudiante.includes(textoBusqueda) ||
        idioma.includes(textoBusqueda)
      );
    }
  );

  const totalMatriculados = listaInscripciones.filter(
    (inscripcion) => inscripcion.matriculado
  ).length;

  const formatoMoneda = (valor) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(Number(valor) || 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section>
          <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
            Panel de administración
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Gestión de inscripciones
          </h2>
          <p className="mt-2 text-slate-500">
            Registra estudiantes y administra sus cursos de idiomas.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">
                Total de inscripciones
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {listaInscripciones.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">
                Estudiantes matriculados
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {totalMatriculados}
              </p>
            </div>
          </div>
        </section>

        {mensaje && (
          <div
            role="alert"
            className={`flex items-start gap-3 rounded-xl border p-4 ${
              tipoMensaje === "error"
                ? "border-red-200 bg-red-50 text-red-800"
                : "border-green-200 bg-green-50 text-green-800"
            }`}
          >
            {tipoMensaje === "error" ? (
              <CircleAlert className="mt-0.5 shrink-0" size={20} />
            ) : (
              <CheckCircle2 className="mt-0.5 shrink-0" size={20} />
            )}
            <p className="flex-1 text-sm">{mensaje}</p>
            <button
              type="button"
              onClick={() => setMensaje("")}
              aria-label="Cerrar mensaje"
              className="rounded-md p-1 hover:bg-black/5"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
              {idEdicion ? <Pencil size={21} /> : <UserPlus size={21} />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {idEdicion ? "Editar inscripción" : "Registrar estudiante"}
              </h3>
              <p className="text-sm text-slate-500">
                {idEdicion
                  ? "Modifica la información del estudiante."
                  : "Ingresa los datos para registrar una nueva inscripción."}
              </p>
            </div>
          </div>

          <form onSubmit={manejarEnvio} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="estudiante"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Nombre del estudiante
                </label>
                <input
                  id="estudiante"
                  name="estudiante"
                  type="text"
                  minLength={2}
                  maxLength={100}
                  value={formulario.estudiante}
                  onChange={manejarCambio}
                  placeholder="Ej. Laura Gómez"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-4 focus:ring-green-100"
                />
              </div>

              <div>
                <label
                  htmlFor="idioma_nivel"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Idioma y nivel
                </label>
                <input
                  id="idioma_nivel"
                  name="idioma_nivel"
                  type="text"
                  minLength={2}
                  maxLength={100}
                  value={formulario.idioma_nivel}
                  onChange={manejarCambio}
                  placeholder="Ej. Inglés B1"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-4 focus:ring-green-100"
                />
              </div>

              <div>
                <label
                  htmlFor="costo_modulo"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Costo del módulo (COP)
                </label>
                <input
                  id="costo_modulo"
                  name="costo_modulo"
                  type="number"
                  min="1"
                  step="any"
                  value={formulario.costo_modulo}
                  onChange={manejarCambio}
                  placeholder="Ej. 350000"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-4 focus:ring-green-100"
                />
              </div>

              <div className="flex items-center">
                <label className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <input
                    name="matriculado"
                    type="checkbox"
                    checked={formulario.matriculado}
                    onChange={manejarCambio}
                    className="h-5 w-5 accent-green-700"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-slate-800">
                      Estudiante matriculado
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      Indica si la matrícula está activa.
                    </span>
                  </span>
                </label>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
              <button
                type="submit"
                disabled={guardando}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {guardando ? (
                  <LoaderCircle className="animate-spin" size={19} />
                ) : (
                  <Save size={19} />
                )}
                {guardando
                  ? "Guardando..."
                  : idEdicion
                    ? "Guardar cambios"
                    : "Registrar inscripción"}
              </button>

              {idEdicion && (
                <button
                  type="button"
                  onClick={limpiarFormulario}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  <X size={19} />
                  Cancelar edición
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Inscripciones registradas
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Consulta y administra los estudiantes.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="search"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar estudiante..."
                  aria-label="Buscar por estudiante o idioma"
                  className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100 sm:w-64"
                />
              </div>

              <button
                type="button"
                onClick={cargarInscripciones}
                disabled={cargando}
                aria-label="Actualizar listado"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                <RefreshCw
                  size={18}
                  className={cargando ? "animate-spin" : ""}
                />
                Actualizar
              </button>
            </div>
          </div>

          {cargando ? (
            <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-slate-500">
              <LoaderCircle
                size={32}
                className="animate-spin text-green-700"
              />
              <p className="text-sm">Cargando inscripciones...</p>
            </div>
          ) : inscripcionesFiltradas.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <BookOpen size={27} />
              </div>
              <h4 className="mt-4 font-semibold text-slate-800">
                {busqueda
                  ? "No se encontraron resultados"
                  : "Aún no hay inscripciones"}
              </h4>
              <p className="mt-2 max-w-sm text-sm text-slate-500">
                {busqueda
                  ? "Intenta buscar con otro nombre o idioma."
                  : "Registra un estudiante con el formulario para que aparezca en este listado."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Estudiante</th>
                    <th className="px-6 py-4 font-semibold">Idioma y nivel</th>
                    <th className="px-6 py-4 font-semibold">Costo del módulo</th>
                    <th className="px-6 py-4 font-semibold">Estado</th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {inscripcionesFiltradas.map((inscripcion) => (
                    <tr
                      key={inscripcion.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-800">
                            {String(inscripcion.estudiante ?? "?")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <span className="font-semibold text-slate-800">
                            {inscripcion.estudiante}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {inscripcion.idioma_nivel}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-700">
                        {formatoMoneda(inscripcion.costo_modulo)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            inscripcion.matriculado
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {inscripcion.matriculado
                            ? "Matriculado"
                            : "Pendiente"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => manejarEdicion(inscripcion)}
                            aria-label={`Editar ${inscripcion.estudiante}`}
                            title="Editar inscripción"
                            className="rounded-lg p-2 text-blue-700 transition hover:bg-blue-50"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            type="button"
                            onClick={() => manejarEliminacion(inscripcion)}
                            aria-label={`Eliminar ${inscripcion.estudiante}`}
                            title="Eliminar inscripción"
                            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!cargando && inscripcionesFiltradas.length > 0 && (
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-500">
              Mostrando {inscripcionesFiltradas.length} de{" "}
              {listaInscripciones.length} inscripciones
            </div>
          )}
        </section>

        <footer className="pb-4 text-center text-sm text-slate-400">
          Centro de Idiomas · Sistema de gestión de inscripciones
        </footer>
      </main>
    </div>
  );
}

export default Inscripciones;
