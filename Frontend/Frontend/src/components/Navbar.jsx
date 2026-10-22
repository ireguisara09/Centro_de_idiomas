
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { GraduationCap, Menu, X, Users } from "lucide-react";

function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const enlaceClase = ({ isActive }) =>
    `block rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
      isActive
        ? "bg-green-100 text-green-800"
        : "text-slate-600 hover:bg-slate-100 hover:text-green-800"
    }`;

  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={cerrarMenu}
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
            <GraduationCap size={27} />
          </div>

          <div>
            <span className="block text-lg font-bold text-slate-900">
              Centro de Idiomas
            </span>
            <span className="block text-xs text-slate-500">
              Gestión académica
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <NavLink to="/inscripciones" className={enlaceClase}>
            <span className="flex items-center gap-2">
              <Users size={17} />
              Inscripciones
            </span>
          </NavLink>

          <NavLink to="/Homepage" className={enlaceClase}>
            <span className="flex items-center gap-2">
              <Users size={17} />
              Consultar inscripciones
            </span>
          </NavLink>
        </div>

        <button
          type="button"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuAbierto}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
        >
          {menuAbierto ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuAbierto && (
        <div className="border-t border-slate-200 px-4 py-3 md:hidden">
          <NavLink
            to="/inscripciones"
            onClick={cerrarMenu}
            className={enlaceClase}
          >
            <span className="flex items-center gap-2">
              <Users size={17} />
              Inscripciones
            </span>
          </NavLink>

          <NavLink
            to="/consulta"
            onClick={cerrarMenu}
            className={enlaceClase}
          >
            <span className="flex items-center gap-2">
              <Users size={17} />
              Consultar inscripciones
            </span>
          </NavLink>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
