import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/sgpa", label: "SGPA" },
  { to: "/cgpa", label: "CGPA" },
  { to: "/required-ese", label: "Required ESE" },
  { to: "/expected-grade", label: "Expected Grade" },
];

function Navbar() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#0b0b16]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="text-3xl font-extrabold tracking-tight text-cyanAccent">
          Gradely
        </NavLink>

        <nav className="hidden items-center gap-5 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-semibold transition ${
                  isActive
                    ? "border-b-2 border-cyanAccent pb-1 text-cyanAccent"
                    : "text-white/80 hover:text-cyanAccent"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
