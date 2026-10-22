import IdiomaCard from "./IdiomaCard";

function IdiomaList({ inscripciones, onCambiarEstado }) {
  if (inscripciones.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <p className="text-lg font-semibold text-slate-700">
          No hay inscripciones registradas
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Cuando registres estudiantes, aparecerán aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {inscripciones.map((inscripcion) => (
        <IdiomaCard
          key={inscripcion.id}
          inscripcion={inscripcion}
          onCambiarEstado={onCambiarEstado}
        />
      ))}
    </div>
  );
}

export default IdiomaList;


