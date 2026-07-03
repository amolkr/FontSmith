import { Link, NavLink } from "react-router-dom";
import { Moon, PenTool, Sun } from "lucide-react";
import { Button } from "../ui/Button";
import { useTheme } from "../../context/ThemeContext";

export function PublicNav() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-white/55 backdrop-blur-xl dark:bg-ink/55">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 font-display text-xl font-extrabold text-ink dark:text-paper">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-sea to-coral text-ink">
            <PenTool className="h-5 w-5" />
          </span>
          FontSmith
        </Link>
        <div className="hidden items-center gap-6 text-sm font-bold text-ink/70 dark:text-paper/70 md:flex">
          {["Features", "Process", "Gallery", "FAQ"].map((item) => (
            <a key={item} href={`/#${item.toLowerCase()}`} className="hover:text-coral">
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="grid h-11 w-11 place-items-center rounded-lg text-ink hover:bg-ink/5 dark:text-paper dark:hover:bg-white/10"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <NavLink to="/dashboard">
            <Button variant="secondary" className="hidden sm:inline-flex">
              Dashboard
            </Button>
          </NavLink>
          <NavLink to="/upload">
            <Button>Get Started</Button>
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
