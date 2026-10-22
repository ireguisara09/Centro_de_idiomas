import { CheckCircle2, Circle, UserRound, Languages, DollarSign } from "lucide-react";

function IdiomaCard({ inscripcion, onCambiarEstado }) {
  const estaMatriculado = inscripcion.matriculado === true;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
          <UserRound size={25} />
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            estaMatriculado
              ? "bg-green-100 text-green-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {estaMatriculado ? "Matriculado" : "Pendiente"}
        </span>
      </div>

      <h3 className="mb-4 text-lg font-bold text-slate-900">
        {inscripcion.estudiante}
      </h3>

      <div className="space-y-3 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Languages size={18} className="text-green-700" />
          <span>{inscripcion.idioma_nivel}</span>
        </div>

        <div className="flex items-center gap-2">
          <DollarSign size={18} className="text-green-700" />
          <span>
            {Number(inscripcion.costo_modulo).toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
              maximumFractionDigits: 0
            })}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onCambiarEstado(inscripcion)}
        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
          estaMatriculado
            ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
            : "bg-green-700 text-white hover:bg-green-800"
        }`}
      >
        {estaMatriculado ? (
          <CheckCircle2 size={20} />
        ) : (
          <Circle size={20} />
        )}
        {estaMatriculado ? "Marcar como pendiente" : "Confirmar matrícula"}
      </button>
    </article>
  );
}

export default IdiomaCard;
