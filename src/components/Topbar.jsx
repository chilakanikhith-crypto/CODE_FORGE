import { Sun, Moon } from "lucide-react";

export default function Topbar({ darkMode, setDarkMode }) {
  return (
    <header
      className={`
        h-20 sticky top-0 z-50
        flex items-center justify-between px-6
        border-b backdrop-blur-xl
        transition-colors duration-300
        ${
          darkMode
            ? "bg-slate-950/90 border-slate-700"
            : "bg-white/90 border-slate-200"
        }
      `}
    >
      <div>
        <h2
          className={`text-xl font-bold ${
            darkMode ? "text-white" : "text-slate-900"
          }`}
        >
          GRIET INTELLIGENT CAMPUS
        </h2>

        <p
          className={`text-sm mt-1 ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          AI Powered Digital Twin
        </p>
      </div>

      <div className="flex items-center gap-4">
        <span
          className={`hidden sm:block text-sm font-medium ${
            darkMode ? "text-slate-300" : "text-slate-600"
          }`}
        >
          {darkMode ? "Dark Mode" : "Light Mode"}
        </span>

        <button
          type="button"
          onClick={() => setDarkMode((previous) => !previous)}
          aria-label={
            darkMode
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          className={`
            relative w-16 h-9 rounded-full
            border flex items-center px-1
            cursor-pointer transition-all duration-300
            ${
              darkMode
                ? "bg-slate-800 border-cyan-500"
                : "bg-slate-200 border-slate-300"
            }
          `}
        >
          <span
            className={`
              w-7 h-7 rounded-full
              flex items-center justify-center
              shadow-md transition-transform duration-300
              ${
                darkMode
                  ? "translate-x-7 bg-slate-700"
                  : "translate-x-0 bg-white"
              }
            `}
          >
            {darkMode ? (
              <Moon size={16} className="text-cyan-400" />
            ) : (
              <Sun size={17} className="text-yellow-500" />
            )}
          </span>
        </button>
      </div>
    </header>
  );
}