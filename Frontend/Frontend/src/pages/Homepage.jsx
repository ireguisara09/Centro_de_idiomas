import { useEffect, useState } from "react";
import { GraduationCap, RefreshCw, Users } from "lucide-react";
import { fetchInscripciones, updateInscripcion } from "../api/inscripciones";
import IdiomaList from "../components/IdiomaList";

function Homepage() {
  const [inscripciones, setInscripciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarInscripciones = async () => {
    setCargando(true);
    setError("");

    try {
      const datos = await fetchInscripciones();
      setInscripciones(Array.isArray(datos) ? datos : []);
    } catch {
      setError("No fue posible cargar las inscripciones.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarInscripciones();
  }, []);

  const cambiarEstado = async (inscripcion) => {
    const datosActualizados = {
      estudiante: inscripcion.estudiante,
      idioma_nivel: inscripcion.idioma_nivel,
      costo_modulo: inscripcion.costo_modulo,
      matriculado: !inscripcion.matriculado
    };

    try {
      const respuesta = await updateInscripcion(
        inscripcion.id,
        datosActualizados
      );

      setInscripciones((actuales) =>
        actuales.map((item) =>
          item.id === inscripcion.id
            ? { ...item, ...respuesta }
            : item
        )
      );
    } catch {
      setError("No se pudo actualizar el estado de la matrícula.");
    }
  };

  const matriculados = inscripciones.filter(
    (item) => item.matriculado === true
  ).length;

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8 rounded-2xl bg-green-800 p-6 text-white sm:p-8">
        <div className="flex items-center gap-3">
          <GraduationCap size={34} />
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Consulta de inscripciones
            </h1>
            <p className="mt-2 text-sm text-green-100 sm:text-base">
              Revisa los estudiantes y el estado de sus matrículas.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-100 p-3 text-green-700">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">
                Total de inscripciones
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {inscripciones.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
              <GraduationCap size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">
                Estudiantes matriculados
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {matriculados}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Listado de estudiantes
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Consulta y actualiza el estado de cada matrícula.
            </p>
          </div>

          <button
            type="button"
            onClick={cargarInscripciones}
            disabled={cargando}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={17} />
            Actualizar
          </button>
        </div>

        {error && (
          <p className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </p>
        )}

        {cargando ? (
          <p className="py-10 text-center text-slate-500">
            Cargando inscripciones...
          </p>
        ) : (
          <IdiomaList
            inscripciones={inscripciones}
            onCambiarEstado={cambiarEstado}
          />
        )}
      </section>
    </main>
  );
}

export default Homepage;
