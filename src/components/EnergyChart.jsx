import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { time: "8 AM", energy: 25 },
  { time: "10 AM", energy: 42 },
  { time: "12 PM", energy: 67 },
  { time: "2 PM", energy: 81 },
  { time: "4 PM", energy: 73 },
  { time: "6 PM", energy: 52 },
];

export default function EnergyChart({ darkMode }) {
  const textColor = darkMode ? "#94A3B8" : "#64748B";

  return (
    <div
      className={`
        rounded-2xl
        p-4
        overflow-hidden
        transition-colors
        duration-300
        ${
          darkMode
            ? "bg-slate-800"
            : "bg-slate-50 border border-slate-200"
        }
      `}
    >

      <h3 className="text-xl font-bold text-cyan-400 mb-5">
        ⚡ Energy Usage
      </h3>

      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={data}>

          <XAxis
            dataKey="time"
            stroke={textColor}
          />

          <YAxis
            stroke={textColor}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: darkMode
                ? "#0f172a"
                : "#ffffff",
              border: darkMode
                ? "1px solid #334155"
                : "1px solid #cbd5e1",
              borderRadius: "12px",
              color: darkMode
                ? "#ffffff"
                : "#0f172a",
            }}
          />

          <Line
            type="monotone"
            dataKey="energy"
            stroke="#22d3ee"
            strokeWidth={4}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}