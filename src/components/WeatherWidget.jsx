import { useEffect, useState } from "react";

export default function WeatherWidget({ darkMode }) {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchWeather() {
            try {
                const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
                const city = "Hyderabad";

                if (!apiKey) {
                    throw new Error("OpenWeather API key missing");
                }

                const res = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
                );

                if (!res.ok) {
                    throw new Error(`Weather API error: ${res.status}`);
                }

                const data = await res.json();

                if (data.cod !== 200) {
                    throw new Error(data.message || "Weather unavailable");
                }

                setWeather(data);
            } catch (error) {
                console.error("Weather Error:", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchWeather();
    }, []);

    /* =========================
       LOADING
    ========================= */

    if (loading) {
        return (
            <div
                className={`
                    rounded-3xl
                    border
                    p-6
                    shadow-lg
                    transition-all
                    duration-300
                    ${
                        darkMode
                            ? "bg-slate-900/90 border-slate-700"
                            : "bg-slate-100/90 border-slate-300"
                    }
                `}
            >
                <p
                    className={
                        darkMode
                            ? "text-white"
                            : "text-slate-900"
                    }
                >
                    Loading weather...
                </p>
            </div>
        );
    }

    /* =========================
       ERROR
    ========================= */

    if (error || !weather) {
        return (
            <div
                className={`
                    rounded-3xl
                    border
                    p-6
                    shadow-lg
                    transition-all
                    duration-300
                    ${
                        darkMode
                            ? "bg-slate-900/90 border-red-500/70"
                            : "bg-slate-100/90 border-red-400"
                    }
                `}
            >
                <p className="text-red-400 font-medium">
                    Unable to load weather.
                </p>

                <p
                    className={`
                        text-sm
                        mt-2
                        ${
                            darkMode
                                ? "text-slate-400"
                                : "text-slate-600"
                        }
                    `}
                >
                    Please check the OpenWeather API key.
                </p>
            </div>
        );
    }

    return (
        <div
            className={`
                rounded-3xl
                border
                p-6
                shadow-xl
                backdrop-blur-xl
                transition-all
                duration-500
                ${
                    darkMode
                        ? "bg-slate-900/90 border-slate-700"
                        : "bg-slate-100/90 border-slate-300"
                }
            `}
        >

            {/* HEADER */}

            <div className="flex justify-between items-start mb-6">

                <div>
                    <h2 className="text-2xl font-bold text-cyan-400">
                        🌤️ Campus Weather
                    </h2>

                    <p
                        className={`
                            mt-1
                            ${
                                darkMode
                                    ? "text-slate-300"
                                    : "text-slate-600"
                            }
                        `}
                    >
                        Live weather conditions
                    </p>
                </div>

                <div className="text-right">

                    <p
                        className={`
                            text-4xl
                            font-bold
                            ${
                                darkMode
                                    ? "text-white"
                                    : "text-slate-900"
                            }
                        `}
                    >
                        {Math.round(weather.main.temp)}°
                    </p>

                    <p
                        className={`
                            mt-1
                            ${
                                darkMode
                                    ? "text-slate-300"
                                    : "text-slate-600"
                            }
                        `}
                    >
                        {weather.weather[0].main}
                    </p>

                </div>

            </div>

            {/* WEATHER DETAILS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                {/* CITY */}

                <div
                    className={`
                        rounded-2xl
                        p-5
                        border
                        transition-all
                        duration-300
                        ${
                            darkMode
                                ? "bg-slate-800 border-slate-700"
                                : "bg-white/70 border-slate-200"
                        }
                    `}
                >
                    <p
                        className={`
                            text-lg
                            ${
                                darkMode
                                    ? "text-slate-300"
                                    : "text-slate-600"
                            }
                        `}
                    >
                        📍 City
                    </p>

                    <p
                        className={`
                            text-xl
                            font-semibold
                            mt-2
                            ${
                                darkMode
                                    ? "text-white"
                                    : "text-slate-900"
                            }
                        `}
                    >
                        {weather.name}
                    </p>
                </div>

                {/* HUMIDITY */}

                <div
                    className={`
                        rounded-2xl
                        p-5
                        border
                        transition-all
                        duration-300
                        ${
                            darkMode
                                ? "bg-slate-800 border-slate-700"
                                : "bg-white/70 border-slate-200"
                        }
                    `}
                >
                    <p
                        className={`
                            text-lg
                            ${
                                darkMode
                                    ? "text-slate-300"
                                    : "text-slate-600"
                            }
                        `}
                    >
                        💧 Humidity
                    </p>

                    <p
                        className={`
                            text-xl
                            font-semibold
                            mt-2
                            ${
                                darkMode
                                    ? "text-white"
                                    : "text-slate-900"
                            }
                        `}
                    >
                        {weather.main.humidity}%
                    </p>
                </div>

                {/* WIND */}

                <div
                    className={`
                        rounded-2xl
                        p-5
                        border
                        transition-all
                        duration-300
                        ${
                            darkMode
                                ? "bg-slate-800 border-slate-700"
                                : "bg-white/70 border-slate-200"
                        }
                    `}
                >
                    <p
                        className={`
                            text-lg
                            ${
                                darkMode
                                    ? "text-slate-300"
                                    : "text-slate-600"
                            }
                        `}
                    >
                        💨 Wind
                    </p>

                    <p
                        className={`
                            text-xl
                            font-semibold
                            mt-2
                            ${
                                darkMode
                                    ? "text-white"
                                    : "text-slate-900"
                            }
                        `}
                    >
                        {weather.wind.speed} m/s
                    </p>
                </div>

                {/* FEELS LIKE */}

                <div
                    className={`
                        rounded-2xl
                        p-5
                        border
                        transition-all
                        duration-300
                        ${
                            darkMode
                                ? "bg-slate-800 border-slate-700"
                                : "bg-white/70 border-slate-200"
                        }
                    `}
                >
                    <p
                        className={`
                            text-lg
                            ${
                                darkMode
                                    ? "text-slate-300"
                                    : "text-slate-600"
                            }
                        `}
                    >
                        🌡️ Feels Like
                    </p>

                    <p
                        className={`
                            text-xl
                            font-semibold
                            mt-2
                            ${
                                darkMode
                                    ? "text-white"
                                    : "text-slate-900"
                            }
                        `}
                    >
                        {Math.round(weather.main.feels_like)}°
                    </p>
                </div>

            </div>
        </div>
    );
}