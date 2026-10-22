import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";

const formularioInicial = {
  estudiante: "",
  idioma_nivel: "",
  costo_modulo: "",
  matriculado: false
};

function IdiomaForm({ inscripcion, onGuardar, onCancelar }) {
  const [formulario, setFormulario] = useState(formularioInicial);
  const [error, setError] = useState("");

  const modoEdicion = Boolean(inscripcion?.id);

  useEffect(() => {
    if (inscripcion) {
      setFormulario({
        estudiante: inscripcion.estudiante ?? "",
        idioma_nivel: inscripcion.idioma_nivel ?? "",
        costo_modulo: inscripcion.costo_modulo ?? "",
        matriculado: inscripcion.matriculado === true
      });
    } else {
      setFormulario(formularioInicial);
    }

    setError("");
  }, [inscripcion]);

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;

    setFormulario((actual) => ({
      ...actual,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const manejarEnvio = (e) => {
    e.preventDefault();

    if (
      !formulario.estudiante.trim() ||
      !formulario.idioma_nivel.trim() ||
      formulario.costo_modulo === "" ||
      Number(formulario.costo_modulo) < 0
    ) {
      setError("Completa todos los campos con valores válidos.");
      return;
    }

    setError("");

    onGuardar({
      ...formulario,
      costo_modulo: Number(formulario.costo_modulo),
      matriculado: formulario.matriculado
    });
  };

  return (
    <form
      onSubmit={manejarEnvio}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          {modoEdicion ? "Editar inscripción" : "Nueva inscripción"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {modoEdicion
            ? "Modifica los datos del estudiante."
            : "Completa los datos para registrar un estudiante."}
        </p>
      </div>

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
          value={formulario.estudiante}
          onChange={manejarCambio}
          required
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          placeholder="Nombre completo"
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
          value={formulario.idioma_nivel}
          onChange={manejarCambio}
          required
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          placeholder="Ej. Inglés - A1"
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
          min="0"
          step="1"
          value={formulario.costo_modulo}
          onChange={manejarCambio}
          required
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          placeholder="Ej. 250000"
        />
      </div>

      <label className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
        <input
          type="checkbox"
          name="matriculado"
          checked={formulario.matriculado}
          onChange={manejarCambio}
          className="h-4 w-4 accent-green-700"
        />
        Estudiante matriculado
      </label>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
        >
          <Save size={18} />
          {modoEdicion ? "Guardar cambios" : "Crear inscripción"}
        </button>

        {onCancelar && (
          <button
            type="button"
            onClick={onCancelar}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-200"
          >
            <X size={18} />
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default IdiomaForm;
