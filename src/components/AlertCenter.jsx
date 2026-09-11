import React, { useState } from "react";
import {
  TriangleAlert,
  ShieldAlert,
  Flame,
  Droplets,
  Zap,
  Users,
  Radio,
  CheckCircle2,
  Bell,
  Volume2,
  Clock,
  Filter,
  Check,
  PlusCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export default function AlertCenter({
  alerts,
  onAddAlert,
  onResolveAlert,
  onAcknowledgeAlert,
  onClearAllAlerts,
  darkMode,
}) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [sirenActive, setSirenActive] = useState(false);

  // Pre-configured alert simulation blueprints
  const alertSimulations = [
    {
      type: "electrical",
      level: "Critical",
      title: "Substation Surge & Fire Hazard",
      icon: "⚡",
      building: "Block 2 Substation",
      color: "border-red-500 bg-red-500/15",
      message:
        "SCT-013 hardware sensor detected RMS current spike above 18.4A. Potential electrical arcing in primary breaker. Immediate inspection required.",
    },
    {
      type: "water",
      level: "Critical",
      title: "High-Pressure Water Pipe Rupture",
      icon: "💧",
      building: "Block 4 Mechanical Zone",
      color: "border-blue-500 bg-blue-500/15",
      message:
        "Ultrasonic water sensor logged a 45% drop in reservoir pressure within 3 minutes. Solenoid shut-off valve signaled.",
    },
    {
      type: "overcrowding",
      level: "Critical",
      title: "Block 1 Overcrowding Warning",
      icon: "👥",
      building: "Block 1 Main Auditorium",
      color: "border-amber-500 bg-amber-500/15",
      message:
        "Optical beam entry counters logged 1,320 occupants. Safe fire occupancy limit (1,000) exceeded by 32%.",
    },
    {
      type: "hardware",
      level: "Warning",
      title: "ESP32 Sensor Gateway Disconnect",
      icon: "🔌",
      building: "Block 3 Roof Mast",
      color: "border-yellow-500 bg-yellow-500/15",
      message:
        "No heartbeat received from COM3 / ESP32-WROOM node for 45 seconds. Telemetry falling back to buffered cache.",
    },
    {
      type: "heatwave",
      level: "Warning",
      title: "Microclimate Extreme Heat Index",
      icon: "🌡️",
      building: "Campus Quadrangle & Green Zone",
      color: "border-orange-500 bg-orange-500/15",
      message:
        "DHT22 probes logged ambient temperature at 39.4°C with 65% humidity (Heat Index: 46°C). Automated mist cooling initiated.",
    },
  ];

  // Trigger one of the simulated alerts
  const triggerSimulation = (sim) => {
    const newAlert = {
      id: Date.now(),
      ...sim,
      time: "Just now",
      status: "unacknowledged",
      resolved: false,
    };
    onAddAlert(newAlert);

    if (sim.level === "Critical") {
      setSirenActive(true);
      setTimeout(() => setSirenActive(false), 3000);
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "critical") return alert.level === "Critical" && !alert.resolved;
    if (activeFilter === "warning") return alert.level === "Warning" && !alert.resolved;
    if (activeFilter === "info") return alert.level === "Info" && !alert.resolved;
    if (activeFilter === "resolved") return alert.resolved;
    return true;
  });

  const criticalCount = alerts.filter((a) => a.level === "Critical" && !a.resolved).length;
  const warningCount = alerts.filter((a) => a.level === "Warning" && !a.resolved).length;
  const resolvedCount = alerts.filter((a) => a.resolved).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div
        className={`rounded-3xl border p-6 relative overflow-hidden shadow-2xl transition-all ${
          darkMode
            ? "bg-gradient-to-r from-slate-900 via-slate-900 to-red-950/30 border-red-500/30 shadow-red-950/20"
            : "bg-gradient-to-r from-slate-900 via-slate-800 to-red-900 border-slate-700 text-white shadow-xl"
        }`}
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shadow-lg shadow-red-500/20 shrink-0">
              <TriangleAlert size={36} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse">
                  🚨 REAL-TIME INCIDENT ENGINE
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  SMART DISPATCH & PROTOCOL
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Campus Emergency & Alert Center
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Centralized hazard monitoring system. Ingests alerts from hardware sensors, electrical telemetry, water meters, and student flow counters.
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 shrink-0">
            <div className="text-center px-3 border-r border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Critical</span>
              <p className="text-2xl font-black text-red-400">{criticalCount}</p>
            </div>
            <div className="text-center px-3 border-r border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Warnings</span>
              <p className="text-2xl font-black text-yellow-400">{warningCount}</p>
            </div>
            <div className="text-center px-3">
              <span className="text-[10px] uppercase font-bold text-slate-400">Resolved</span>
              <p className="text-2xl font-black text-green-400">{resolvedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Simulation Dispatcher Bar */}
      <div
        className={`rounded-3xl border p-6 transition-all ${
          darkMode
            ? "bg-slate-900/90 border-slate-800"
            : "bg-white border-slate-200 shadow-md"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2
              className={`text-lg font-bold tracking-tight flex items-center gap-2 ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              <Sparkles size={20} className="text-cyan-400" />
              Simulate & Trigger Different Campus Alerts
            </h2>
            <p className="text-xs text-slate-400">
              Click any button below to instantly trigger different real-world incident scenarios
            </p>
          </div>

          {alerts.some((a) => !a.resolved) && (
            <button
              type="button"
              onClick={onClearAllAlerts}
              className="text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl bg-green-500/15 text-green-300 hover:bg-green-500/25 border border-green-500/30 transition-all flex items-center gap-1.5 self-start sm:self-auto"
            >
              <CheckCircle2 size={14} /> Resolve All Active Alerts
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {alertSimulations.map((sim, i) => (
            <button
              key={i}
              type="button"
              onClick={() => triggerSimulation(sim)}
              className={`p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.02] flex flex-col justify-between group ${
                sim.type === "electrical"
                  ? "border-red-500/30 bg-red-500/10 hover:border-red-500 text-red-300"
                  : sim.type === "water"
                  ? "border-blue-500/30 bg-blue-500/10 hover:border-blue-500 text-blue-300"
                  : sim.type === "overcrowding"
                  ? "border-amber-500/30 bg-amber-500/10 hover:border-amber-500 text-amber-300"
                  : sim.type === "hardware"
                  ? "border-yellow-500/30 bg-yellow-500/10 hover:border-yellow-500 text-yellow-300"
                  : "border-orange-500/30 bg-orange-500/10 hover:border-orange-500 text-orange-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{sim.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900/60">
                  {sim.level}
                </span>
              </div>
              <div className="font-bold text-xs leading-snug">
                {sim.title}
              </div>
              <div className="text-[10px] opacity-75 mt-1">
                Trigger {sim.building}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveFilter("all")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeFilter === "all"
              ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
              : darkMode
              ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
          }`}
        >
          All Alerts ({alerts.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter("critical")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeFilter === "critical"
              ? "bg-red-500 text-white shadow-md shadow-red-500/20"
              : darkMode
              ? "bg-slate-800 text-red-400 hover:bg-slate-700"
              : "bg-slate-200 text-red-600 hover:bg-slate-300"
          }`}
        >
          Critical ({criticalCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter("warning")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeFilter === "warning"
              ? "bg-yellow-500 text-slate-950 shadow-md shadow-yellow-500/20"
              : darkMode
              ? "bg-slate-800 text-yellow-400 hover:bg-slate-700"
              : "bg-slate-200 text-yellow-700 hover:bg-slate-300"
          }`}
        >
          Warnings ({warningCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter("resolved")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeFilter === "resolved"
              ? "bg-green-500 text-white shadow-md shadow-green-500/20"
              : darkMode
              ? "bg-slate-800 text-green-400 hover:bg-slate-700"
              : "bg-slate-200 text-green-700 hover:bg-slate-300"
          }`}
        >
          Resolved Archive ({resolvedCount})
        </button>
      </div>

      {/* Active Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div
            className={`rounded-3xl border p-12 text-center ${
              darkMode
                ? "bg-slate-900/50 border-slate-800 text-slate-400"
                : "bg-white border-slate-200 text-slate-500 shadow"
            }`}
          >
            <CheckCircle2 size={48} className="mx-auto text-green-400 mb-3" />
            <h3 className="text-lg font-bold text-white">No Active Alerts In This Category</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              All physical campus systems are operating within designated parameters. Use the simulation buttons above to test alerts.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isResolved = alert.resolved;
            const isAcknowledged = alert.status === "acknowledged";

            return (
              <div
                key={alert.id}
                className={`rounded-2xl border p-5 transition-all shadow-md ${
                  isResolved
                    ? "opacity-60 border-slate-700 bg-slate-900/40"
                    : alert.level === "Critical"
                    ? "border-red-500/50 bg-red-500/10"
                    : alert.level === "Warning"
                    ? "border-yellow-500/50 bg-yellow-500/10"
                    : "border-blue-500/40 bg-blue-500/10"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{alert.icon || "🚨"}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3
                          className={`text-base font-bold ${
                            darkMode ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {alert.title}
                        </h3>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            alert.level === "Critical"
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : alert.level === "Warning"
                              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                              : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                          }`}
                        >
                          {alert.level}
                        </span>
                        {isResolved && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30">
                            RESOLVED
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="font-semibold text-cyan-400">
                          {alert.building || "Campus Zone"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {alert.time || "Recently"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {!isResolved && (
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {!isAcknowledged ? (
                        <button
                          type="button"
                          onClick={() => onAcknowledgeAlert(alert.id)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                        >
                          Acknowledge
                        </button>
                      ) : (
                        <span className="text-xs text-cyan-400 flex items-center gap-1 font-semibold px-2">
                          <Check size={14} /> Acknowledged
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => onResolveAlert(alert.id)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/40 transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 size={13} /> Resolve
                      </button>
                    </div>
                  )}
                </div>

                <p
                  className={`mt-3 text-sm leading-relaxed ${
                    darkMode ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {alert.message}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
