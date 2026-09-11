import { useEffect, useState } from "react";

export default function LiveClock({ darkMode }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`
        relative
        overflow-hidden
        border
        rounded-3xl
        px-7
        py-5
        flex
        justify-between
        items-center
        shadow-lg
        backdrop-blur-xl
        transition-all
        duration-500
        ${
          darkMode
            ? "bg-slate-900/90 border-slate-700 shadow-black/20"
            : "bg-slate-100/90 border-slate-300 shadow-slate-400/20"
        }
      `}
    >
      {!darkMode && (
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-50/60 via-transparent to-blue-50/70 pointer-events-none" />
      )}

      <div className="relative z-10">
        <h3 className="text-cyan-400 font-semibold text-lg">
          GRIET INTELLIGENT CAMPUS Time
        </h3>

        <p
          className={`
            mt-1
            text-sm
            ${darkMode ? "text-slate-400" : "text-slate-600"}
          `}
        >
          {time.toLocaleDateString()}
        </p>
      </div>

      <h2
        className={`
          relative
          z-10
          text-3xl
          md:text-4xl
          font-bold
          tracking-tight
          ${darkMode ? "text-white" : "text-slate-900"}
        `}
      >
        {time.toLocaleTimeString()}
      </h2>
    </div>
  );
}