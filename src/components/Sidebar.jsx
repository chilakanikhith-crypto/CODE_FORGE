import {
  House,
  Map,
  Users,
  Zap,
  Droplets,
  Wrench,
  Siren,
  Brain,
  LogOut,
} from "lucide-react";

import logo from "../assets/logo.png";

export default function Sidebar({
  activeTab,
  setActiveTab,
  darkMode,
  onLogout,
}) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Home",
      icon: House,
    },
    {
      id: "campus",
      label: "Campus Twin",
      icon: Map,
    },
    {
      id: "occupancy",
      label: "Occupancy",
      icon: Users,
    },
    {
      id: "energy",
      label: "Energy",
      icon: Zap,
    },
    {
      id: "water",
      label: "Water",
      icon: Droplets,
    },
    {
      id: "maintenance",
      label: "Maintenance",
      icon: Wrench,
    },
    {
      id: "emergency",
      label: "Emergency",
      icon: Siren,
    },
    {
      id: "ai",
      label: "AI Insights",
      icon: Brain,
    },
  ];

  return (
    <aside
      className={`
        fixed
        left-0
        top-0
        bottom-0
        w-64
        z-50
        overflow-hidden
        border-r
        transition-all
        duration-500
        ${
          darkMode
            ? "bg-slate-950 border-slate-800"
            : "bg-slate-100 border-slate-300"
        }
      `}
    >
      {/* =================================================
          GRIET LOGO WALLPAPER
      ================================================= */}

      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <img
          src={logo}
          alt=""
          className={`
            w-72
            h-72
            object-contain
            select-none
            transition-opacity
            duration-500
            ${
              darkMode
                ? "opacity-[0.22]"
                : "opacity-[0.18]"
            }
          `}
        />
      </div>

      {/* =================================================
          SUBTLE GLOW
      ================================================= */}

      <div
        className={`
          absolute
          -top-20
          -right-20
          w-48
          h-48
          rounded-full
          blur-3xl
          pointer-events-none
          ${
            darkMode
              ? "bg-cyan-500/5"
              : "bg-cyan-400/10"
          }
        `}
      />

      {/* =================================================
          SIDEBAR CONTENT
      ================================================= */}

      <div className="relative z-10 h-full">

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className={`
            h-20
            flex
            items-center
            px-6
            border-b
            transition-colors
            duration-500
            ${
              darkMode
                ? "border-slate-800"
                : "border-slate-300"
            }
          `}
        >
          <div>
            <h1
              className={`
                text-xl
                font-bold
                tracking-wide
                ${
                  darkMode
                    ? "text-white"
                    : "text-slate-900"
                }
              `}
            >
              GRIET
            </h1>

            <p
              className={`
                text-xs
                mt-1
                font-semibold
                tracking-wider
                ${
                  darkMode
                    ? "text-cyan-400"
                    : "text-cyan-700"
                }
              `}
            >
              INTELLIGENT CAMPUS
            </p>
          </div>
        </div>

        {/* =================================================
            MENU
        ================================================= */}

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`
                  relative
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  text-left
                  border
                  transition-all
                  duration-300
                  ${
                    active
                      ? darkMode
                        ? `
                          bg-cyan-500/15
                          text-cyan-400
                          border-cyan-500/30
                          shadow-lg
                          shadow-cyan-500/5
                        `
                        : `
                          bg-cyan-100/80
                          text-cyan-700
                          border-cyan-300
                          shadow-md
                          shadow-cyan-900/5
                        `
                      : darkMode
                        ? `
                          text-slate-400
                          border-transparent
                          hover:bg-slate-800/80
                          hover:text-white
                        `
                        : `
                          text-slate-600
                          border-transparent
                          hover:bg-white/80
                          hover:text-slate-900
                        `
                  }
                `}
              >
                {/* Active Indicator */}

                {active && (
                  <span
                    className="
                      absolute
                      left-0
                      top-2
                      bottom-2
                      w-1
                      rounded-r-full
                      bg-cyan-400
                    "
                  />
                )}

                {/* Icon */}

                <Icon
                  size={20}
                  className={`
                    shrink-0
                    transition-transform
                    duration-300
                    ${
                      active
                        ? "scale-110"
                        : ""
                    }
                  `}
                />

                {/* Label */}

                <span className="font-medium">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div
          className={`
            absolute
            bottom-0
            left-0
            right-0
            p-4
            border-t
            backdrop-blur-sm
            transition-colors
            duration-500
            ${
              darkMode
                ? "border-slate-800 bg-slate-950/60"
                : "border-slate-300 bg-slate-100/70"
            }
          `}
        >

          {/* =================================================
              LOGOUT BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={onLogout}
            className={`
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              mb-4
              rounded-xl
              border
              transition-all
              duration-300
              ${
                darkMode
                  ? `
                    text-red-400
                    border-red-500/20
                    hover:bg-red-500/10
                    hover:text-red-300
                  `
                  : `
                    text-red-600
                    border-red-200
                    hover:bg-red-50
                    hover:text-red-700
                  `
              }
            `}
          >
            <LogOut size={19} />

            <span className="font-medium">
              Logout
            </span>
          </button>

          {/* Campus Monitor */}

          <div
            className="
              text-xs
              font-medium
              text-slate-500
            "
          >
            GRIET Campus Monitor
          </div>

          <div
            className={`
              text-[10px]
              mt-1
              ${
                darkMode
                  ? "text-slate-600"
                  : "text-slate-400"
              }
            `}
          >
            AI Powered Digital Twin
          </div>

        </div>
      </div>
    </aside>
  );
}