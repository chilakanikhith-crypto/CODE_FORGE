const alerts = [
  {
    id: 1,
    level: "Critical",
    color: "border-red-500 bg-red-500/10",
    icon: "🔴",
    title: "Lab 3 Energy Spike",
    message:
      "Energy consumption is 18% above the daily average. Immediate inspection recommended.",
  },
  {
    id: 2,
    level: "Warning",
    color: "border-yellow-500 bg-yellow-500/10",
    icon: "🟡",
    title: "Library Occupancy",
    message:
      "Occupancy is expected to exceed 90% within the next 20 minutes.",
  },
  {
    id: 3,
    level: "Normal",
    color: "border-green-500 bg-green-500/10",
    icon: "🟢",
    title: "Hostel Status",
    message:
      "Hostel systems are operating normally. No action required.",
  },
  {
    id: 4,
    level: "Info",
    color: "border-cyan-500 bg-cyan-500/10",
    icon: "🔵",
    title: "Water Management",
    message:
      "Underground water tank has been successfully refilled.",
  },
];

export default function AIAlertEngine({ darkMode }) {
  return (
    <div
      className={`
        border
        rounded-3xl
        p-6
        transition-colors
        duration-300
        ${
          darkMode
            ? "bg-slate-900 border-slate-700"
            : "bg-white border-slate-200"
        }
      `}
    >

      <h2 className="text-3xl font-bold text-cyan-400 mb-6">
        🚨 AI Alert Engine
      </h2>

      <div className="space-y-5">

        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`
              border
              ${alert.color}
              rounded-2xl
              p-5
            `}
          >

            <div className="flex justify-between items-center">

              <h3
                className={`
                  text-xl
                  font-bold
                  ${
                    darkMode
                      ? "text-white"
                      : "text-slate-900"
                  }
                `}
              >
                {alert.icon} {alert.title}
              </h3>

              <span
                className={`
                  text-sm
                  font-semibold
                  ${
                    darkMode
                      ? "text-slate-300"
                      : "text-slate-600"
                  }
                `}
              >
                {alert.level}
              </span>

            </div>

            <p
              className={`
                mt-3
                leading-relaxed
                ${
                  darkMode
                    ? "text-slate-300"
                    : "text-slate-600"
                }
              `}
            >
              {alert.message}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}