export default function NotificationPanel({ darkMode }) {
  const notifications = [
    {
      id: 1,
      color: "text-green-400",
      title: "Engineering Block operating normally",
      time: "Just now",
    },
    {
      id: 2,
      color: "text-yellow-400",
      title: "Library occupancy increasing",
      time: "2 min ago",
    },
    {
      id: 3,
      color: "text-red-400",
      title: "Lab 3 energy consumption is high",
      time: "5 min ago",
    },
    {
      id: 4,
      color: "text-blue-400",
      title: "Water tank refilled",
      time: "8 min ago",
    },
    {
      id: 5,
      color: "text-cyan-400",
      title: "AI recommends reducing AC usage in Labs",
      time: "10 min ago",
    },
  ];

  return (
    <div
      className={`
        border
        rounded-2xl
        p-6
        shadow-xl
        transition-colors
        duration-300
        ${
          darkMode
            ? "bg-slate-900 border-slate-700"
            : "bg-white border-slate-200"
        }
      `}
    >

      <h2 className="text-2xl font-bold text-cyan-400 mb-6">
        🔔 Notifications
      </h2>

      <div className="space-y-4">

        {notifications.map((item) => (
          <div
            key={item.id}
            className={`
              rounded-xl
              p-4
              transition-colors
              ${
                darkMode
                  ? "bg-slate-800 hover:bg-slate-700"
                  : "bg-slate-50 hover:bg-slate-100 border border-slate-200"
              }
            `}
          >
            <p className={`font-semibold ${item.color}`}>
              {item.title}
            </p>

            <p
              className={`
                text-sm
                mt-1
                ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }
              `}
            >
              {item.time}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
}