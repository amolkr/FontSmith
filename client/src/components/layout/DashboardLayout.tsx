import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Clock, GalleryHorizontal, Home, Moon, PenTool, Settings, Sun, Upload } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const links = [
  { to: "/dashboard", label: "Overview", icon: Home },
  { to: "/upload", label: "Upload", icon: Upload },
  { to: "/gallery", label: "Font gallery", icon: GalleryHorizontal },
  { to: "/history", label: "History", icon: Clock },
  { to: "/profile", label: "Settings", icon: Settings }
];

export function DashboardLayout() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-mesh-light text-ink dark:bg-mesh-dark dark:text-paper">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-ink/10 bg-white/62 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-ink/62 lg:block">
        <NavLink to="/" className="flex items-center gap-3 font-display text-xl font-extrabold">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br from-sea to-coral text-ink">
            <PenTool className="h-5 w-5" />
          </span>
          FontSmith
        </NavLink>
        <div className="mt-8 grid gap-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition ${
                  isActive ? "bg-ink text-paper dark:bg-paper dark:text-ink" : "hover:bg-ink/5 dark:hover:bg-white/10"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </div>
        <div className="absolute inset-x-5 bottom-5 rounded-lg border border-ink/10 bg-white/60 p-4 dark:border-white/10 dark:bg-white/8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-sea/20 font-bold text-sea">{user?.name?.[0] ?? "F"}</div>
            <div>
              <p className="text-sm font-bold">{user?.name ?? "FontSmith User"}</p>
              <p className="text-xs text-ink/55 dark:text-paper/55">{user.plan} workspace</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={toggleTheme} className="grid h-10 flex-1 place-items-center rounded-lg hover:bg-ink/5 dark:hover:bg-white/10">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => {
                navigate("/");
              }}
              className="grid h-10 flex-1 place-items-center rounded-lg text-coral hover:bg-coral/10"
            >
              <Home className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
      <main className="lg:pl-72">
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-ink/10 bg-white/65 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-ink/65 lg:hidden">
          <NavLink to="/" className="flex items-center gap-2 font-display font-extrabold">
            <PenTool className="h-5 w-5 text-coral" />
            FontSmith
          </NavLink>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="grid h-10 w-10 place-items-center rounded-lg">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button onClick={() => navigate("/")} className="grid h-10 w-10 place-items-center rounded-lg text-coral">
              <Home className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-ink/10 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-ink/80 lg:hidden">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className="grid min-h-16 place-items-center text-xs font-bold">
            <Icon className="h-5 w-5" />
            <span className="max-w-full truncate px-1">{label.split(" ")[0]}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
