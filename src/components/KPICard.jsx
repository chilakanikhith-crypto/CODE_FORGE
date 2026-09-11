import AnimatedCounter from "./AnimatedCounter";

export default function KPICard({
    title,
    value,
    color,
    icon,
    status,
    darkMode,
}) {
    return (
        <div
            className={`
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                p-6
                shadow-lg
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-cyan-400
                hover:shadow-cyan-500/20
                hover:shadow-2xl
                ${
                    darkMode
                        ? "border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800"
                        : "border-slate-200 bg-white"
                }
            `}
        >
            {/* Glow Effect */}
            <div
                className={`
                    absolute
                    inset-0
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                    ${
                        darkMode
                            ? "bg-cyan-400/5 opacity-0"
                            : "bg-cyan-50 opacity-0"
                    }
                `}
            />

            <div className="relative flex justify-between items-start">

                {/* LEFT */}
                <div>

                    {/* Status */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />

                        <span
                            className={`
                                text-xs
                                uppercase
                                tracking-widest
                                ${
                                    darkMode
                                        ? "text-slate-400"
                                        : "text-slate-500"
                                }
                            `}
                        >
                            {status}
                        </span>
                    </div>

                    {/* Title */}
                    <p
                        className={`
                            text-sm
                            font-medium
                            ${
                                darkMode
                                    ? "text-slate-400"
                                    : "text-slate-600"
                            }
                        `}
                    >
                        {title}
                    </p>

                    {/* Value */}
                    <h2
                        className={`
                            text-4xl
                            lg:text-5xl
                            font-bold
                            mt-4
                            ${color}
                        `}
                    >
                        <AnimatedCounter value={value} />
                    </h2>

                    {/* Footer */}
                    <p className="text-sm text-green-500 mt-5">
                        ▲ Live Monitoring
                    </p>
                </div>

                {/* ICON */}
                <div
                    className={`
                        w-16
                        h-16
                        rounded-2xl
                        border
                        flex
                        items-center
                        justify-center
                        text-cyan-400
                        group-hover:scale-110
                        transition-transform
                        duration-300
                        ${
                            darkMode
                                ? "bg-cyan-500/10 border-cyan-500/20"
                                : "bg-cyan-50 border-cyan-200"
                        }
                    `}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}