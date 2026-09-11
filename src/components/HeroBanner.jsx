import { Sparkles } from "lucide-react";
import campusView from "../assets/campusview2.png";
import grietLogo from "../assets/griet_logo.png";

export default function HeroBanner({ darkMode }) {
  return (
    <div
      className={`
        mb-8
        relative
        overflow-hidden
        rounded-3xl
        border-2
        transition-all
        duration-500
        ${
          darkMode
            ? "border-slate-700 shadow-2xl shadow-black/20"
            : "border-slate-300 shadow-xl shadow-slate-900/10"
        }
      `}
    >
      {/* Campus Image */}
      <div
        className="
          absolute
          inset-0
          bg-cover
          bg-center
          transition-all
          duration-700
        "
        style={{
          backgroundImage: `url(${campusView})`,
        }}
      />

      {/* Light Mode Overlay */}
      {!darkMode && (
        <>
          <div className="absolute inset-0 bg-white/10" />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-white/10
              via-white/5
              to-transparent
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-slate-900/25
              via-transparent
              to-transparent
            "
          />
        </>
      )}

      {/* Dark Mode Overlay */}
      {darkMode && (
        <>
          <div className="absolute inset-0 bg-black/10" />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-black/20
              via-black/10
              to-transparent
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-black/40
              via-transparent
              to-transparent
            "
          />
        </>
      )}

      {/* Content */}
      <div
        className="
          relative
          z-10
          min-h-[300px]
          flex
          items-center
          p-8
          md:p-10
        "
      >
        <div className="flex items-center gap-5 md:gap-6">

          {/* GRIET Logo */}
          <div
            className="
              w-20
              h-20
              md:w-24
              md:h-24
              rounded-full
              bg-white
              p-2
              shadow-xl
              flex
              items-center
              justify-center
              shrink-0
            "
          >
            <img
              src={grietLogo}
              alt="GRIET Logo"
              className="
                w-full
                h-full
                object-contain
              "
            />
          </div>

          {/* Text */}
          <div className="max-w-2xl">

            <div className="flex items-center gap-3">
              <Sparkles
                className="text-cyan-400 shrink-0"
                size={32}
              />

              <h1
                className={`
                  text-3xl
                  md:text-4xl
                  font-bold
                  leading-tight
                  transition-colors
                  duration-300
                  ${
                    darkMode
                      ? "text-white"
                      : "text-slate-950"
                  }
                `}
              >
                GRIET INTELLIGENT CAMPUS
              </h1>
            </div>

            {/* Subtitle */}
            <p
              className={`
                mt-2
                text-lg
                md:text-xl
                font-semibold
                transition-colors
                duration-300
                ${
                  darkMode
                    ? "text-cyan-300"
                    : "text-cyan-700"
                }
              `}
            >
              AI Powered Digital Twin
            </p>

            {/* Description */}
            <p
              className={`
                mt-2
                max-w-xl
                text-sm
                md:text-base
                font-medium
                leading-relaxed
                transition-colors
                duration-300
                ${
                  darkMode
                    ? "text-slate-100"
                    : "text-slate-800"
                }
              `}
            >
              Intelligent campus monitoring,
              occupancy, energy, water and AI analytics.
            </p>

            {/* System Status */}
            <div className="flex items-center gap-2 mt-5">
              <span
                className="
                  w-2.5
                  h-2.5
                  rounded-full
                  bg-green-400
                  animate-pulse
                  shadow-lg
                  shadow-green-400/50
                "
              />

              <span
                className={`
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  ${
                    darkMode
                      ? "text-green-300"
                      : "text-green-700"
                  }
                `}
              >
                Campus Systems Online
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}