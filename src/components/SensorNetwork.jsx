export default function SensorNetwork() {
  const sensors = [
    { top: "12%", left: "46%", label: "📶" },
    { top: "40%", left: "22%", label: "📷" },
    { top: "40%", left: "76%", label: "⚡" },
    { top: "72%", left: "22%", label: "💧" },
    { top: "72%", left: "74%", label: "🌡️" },
  ];

  return (
    <>
      {sensors.map((sensor, index) => (
        <div
          key={index}
          style={{
            top: sensor.top,
            left: sensor.left,
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative">

            <div className="absolute inset-0 rounded-full bg-cyan-400 opacity-40 animate-ping"></div>

            <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-cyan-400 flex items-center justify-center text-xl shadow-lg">

              {sensor.label}

            </div>

          </div>
        </div>
      ))}
    </>
  );
}