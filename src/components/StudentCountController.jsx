import React, { useState } from "react";
import {
  Users,
  Sliders,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Zap,
  Plus,
  Minus,
  CheckCircle2,
} from "lucide-react";

export default function StudentCountController({
  buildings,
  onUpdateBuildings,
  darkMode,
  onTriggerAlert,
}) {
  const [isAutoFlow, setIsAutoFlow] = useState(true);
  const [activePreset, setActivePreset] = useState("normal");

  const totalStudents = buildings.reduce(
    (sum, b) => sum + Number(b.students || 0),
    0
  );
  const maxCampusCapacity = 4500;
  const occupancyPercentage = Math.min(
    100,
    Math.round((totalStudents / maxCampusCapacity) * 100)
  );

  // Preset scenarios
  const presets = [
    {
      id: "normal",
      label: "Normal Academic Day",
      icon: "🏫",
      counts: [820, 680, 710, 620],
      description: "Standard lecture hours across all four academic blocks",
    },
    {
      id: "exam",
      label: "Peak Exam Rush",
      icon: "⚡",
      counts: [1050, 960, 920, 890],
      description: "Heavy attendance during mid-term examination slots",
    },
    {
      id: "overcrowded",
      label: "Mass Overcrowding",
      icon: "🚨",
      counts: [1320, 1180, 1090, 1050],
      description: "Event or convocation: exceeds safe block capacity threshold",
    },
    {
      id: "evening",
      label: "Evening Lab Shift",
      icon: "🌙",
      counts: [350, 420, 240, 180],
      description: "Research labs and postgraduate evening sessions",
    },
    {
      id: "weekend",
      label: "Weekend / Recess",
      icon: "🏖️",
      counts: [110, 85, 90, 65],
      description: "Minimal administrative and library staff present",
    },
  ];

  // Apply a preset scenario
  const applyPreset = (preset) => {
    setActivePreset(preset.id);
    const updated = buildings.map((building, idx) => {
      const newCount = preset.counts[idx] ?? building.students;
      const isRed = newCount > 1100;
      const isYellow = newCount > 850;
      return {
        ...building,
        students: newCount,
        status: isRed ? "red" : isYellow ? "yellow" : "green",
      };
    });

    onUpdateBuildings(updated);

    if (preset.id === "overcrowded" && onTriggerAlert) {
      onTriggerAlert({
        id: Date.now(),
        level: "Critical",
        type: "overcrowding",
        color: "border-red-500 bg-red-500/15",
        icon: "👥",
        title: "Campus-Wide Overcrowding Detected",
        building: "Block 1 & Block 2",
        message:
          "Total student intake exceeded 4,600! Block 1 capacity breached at 1,320 students. Automated crowd-diversion protocol initiated.",
        time: "Just now",
        resolved: false,
      });
    }
  };

  // Adjust total campus count proportionally
  const handleMasterSliderChange = (e) => {
    const targetTotal = Number(e.target.value);
    setActivePreset("custom");

    const currentTotal = totalStudents || 1;
    const ratio = targetTotal / currentTotal;

    const updated = buildings.map((building) => {
      const newStudents = Math.max(20, Math.round(building.students * ratio));
      const isRed = newStudents > 1100;
      const isYellow = newStudents > 850;
      return {
        ...building,
        students: newStudents,
        status: isRed ? "red" : isYellow ? "yellow" : "green",
      };
    });

    onUpdateBuildings(updated);
  };

  // Adjust individual building student count
  const adjustBuildingCount = (buildingId, delta) => {
    setActivePreset("custom");
    const updated = buildings.map((building) => {
      if (building.id === buildingId) {
        const newCount = Math.max(0, building.students + delta);
        const isRed = newCount > 1100;
        const isYellow = newCount > 850;
        return {
          ...building,
          students: newCount,
          status: isRed ? "red" : isYellow ? "yellow" : "green",
        };
      }
      return building;
    });

    onUpdateBuildings(updated);
  };

  const handleManualInput = (buildingId, value) => {
    setActivePreset("custom");
    const parsed = Math.max(0, parseInt(value) || 0);
    const updated = buildings.map((building) => {
      if (building.id === buildingId) {
        const isRed = parsed > 1100;
        const isYellow = parsed > 850;
        return {
          ...building,
          students: parsed,
          status: isRed ? "red" : isYellow ? "yellow" : "green",
        };
      }
      return building;
    });

    onUpdateBuildings(updated);
  };

  // Reset to initial
  const handleReset = () => {
    applyPreset(presets[0]);
  };

  return (
    <div
      className={`rounded-3xl border p-6 transition-all duration-300 shadow-xl ${
        darkMode
          ? "bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-slate-800 shadow-cyan-950/20"
          : "bg-white border-slate-200 shadow-slate-200/50"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
            <Users size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2
                className={`text-2xl font-bold tracking-tight ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Dynamic Student Count Controller
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 animate-pulse">
                LIVE INTERACTIVE
              </span>
            </div>
            <p
              className={`text-sm mt-0.5 ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Adjust real-time campus student density, test overcrowding thresholds, and simulate shifts
            </p>
          </div>
        </div>

        {/* Global Summary Badge */}
        <div className="flex items-center gap-3 bg-slate-800/60 dark:bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-cyan-500/20">
          <div className="text-right">
            <p className="text-xs uppercase font-medium tracking-wider text-slate-400">
              Total Campus Intake
            </p>
            <p className="text-2xl font-extrabold text-cyan-400 tracking-tight">
              {totalStudents.toLocaleString()}
              <span className="text-xs font-normal text-slate-400 ml-1">
                / {maxCampusCapacity} cap
              </span>
            </p>
          </div>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${
              occupancyPercentage > 90
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : occupancyPercentage > 75
                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                : "bg-green-500/20 text-green-400 border border-green-500/30"
            }`}
          >
            {occupancyPercentage}%
          </div>
        </div>
      </div>

      {/* Preset Scenarios */}
      <div className="mt-6">
        <label
          className={`block text-xs uppercase tracking-wider font-semibold mb-3 ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          Quick Scenario Presets
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {presets.map((preset) => {
            const isSelected = activePreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group ${
                  isSelected
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10 scale-[1.02]"
                    : darkMode
                    ? "bg-slate-800/40 border-slate-700/70 hover:bg-slate-800 hover:border-slate-600 text-slate-300"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{preset.icon}</span>
                  {isSelected && (
                    <CheckCircle2 size={16} className="text-cyan-400" />
                  )}
                </div>
                <div className="font-bold text-sm leading-snug">
                  {preset.label}
                </div>
                <div className="text-[11px] opacity-75 mt-1">
                  {preset.counts.reduce((a, b) => a + b, 0)} students
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Master Campus Slider */}
      <div
        className={`mt-6 p-4 rounded-2xl border ${
          darkMode
            ? "bg-slate-800/30 border-slate-800"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold flex items-center gap-2 text-cyan-400">
            <Sliders size={18} /> Master Campus Intake Slider
          </span>
          <span className="text-sm font-bold text-slate-300">
            {totalStudents} students
          </span>
        </div>
        <input
          type="range"
          min="300"
          max="5000"
          step="50"
          value={totalStudents}
          onChange={handleMasterSliderChange}
          className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400 transition-all"
        />
        <div className="flex justify-between text-[11px] text-slate-500 mt-1">
          <span>Low (300)</span>
          <span>Normal (2,800)</span>
          <span>Max Capacity (4,500)</span>
          <span className="text-red-400 font-semibold">Overcrowd (5,000)</span>
        </div>
      </div>

      {/* Individual Building Adjusters */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <label
            className={`text-xs uppercase tracking-wider font-semibold ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Block-Wise Granular Control
          </label>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
          >
            <RotateCcw size={13} /> Reset Defaults
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {buildings.map((building) => {
            const count = building.students || 0;
            const blockCap = 1200;
            const blockPercent = Math.min(100, Math.round((count / blockCap) * 100));
            const isHigh = blockPercent > 85;

            return (
              <div
                key={building.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isHigh
                    ? "border-red-500/40 bg-red-500/5"
                    : darkMode
                    ? "bg-slate-800/50 border-slate-700/60"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{building.icon || "🏢"}</span>
                    <span
                      className={`font-bold text-sm ${
                        darkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {building.name}
                    </span>
                  </div>
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      building.status === "red"
                        ? "bg-red-500 shadow-sm shadow-red-500"
                        : building.status === "yellow"
                        ? "bg-yellow-400"
                        : "bg-green-500"
                    }`}
                  />
                </div>

                {/* Counter Input & Steppers */}
                <div className="flex items-center justify-between gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => adjustBuildingCount(building.id, -50)}
                    className="w-8 h-8 rounded-xl bg-slate-700/60 hover:bg-slate-600 text-white flex items-center justify-center font-bold text-xs transition-colors"
                    title="-50 students"
                  >
                    -50
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustBuildingCount(building.id, -10)}
                    className="w-8 h-8 rounded-xl bg-slate-700/60 hover:bg-slate-600 text-white flex items-center justify-center transition-colors"
                    title="-10 students"
                  >
                    <Minus size={14} />
                  </button>

                  <input
                    type="number"
                    value={count}
                    onChange={(e) =>
                      handleManualInput(building.id, e.target.value)
                    }
                    className={`w-20 text-center font-extrabold text-lg py-1 rounded-xl border ${
                      isHigh
                        ? "text-red-400 border-red-500/50 bg-red-500/10"
                        : "text-cyan-400 border-cyan-500/30 bg-slate-900/80"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => adjustBuildingCount(building.id, 10)}
                    className="w-8 h-8 rounded-xl bg-slate-700/60 hover:bg-slate-600 text-white flex items-center justify-center transition-colors"
                    title="+10 students"
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustBuildingCount(building.id, 50)}
                    className="w-8 h-8 rounded-xl bg-slate-700/60 hover:bg-slate-600 text-white flex items-center justify-center font-bold text-xs transition-colors"
                    title="+50 students"
                  >
                    +50
                  </button>
                </div>

                {/* Progress Mini-Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Density</span>
                    <span className={isHigh ? "text-red-400 font-bold" : ""}>
                      {blockPercent}% ({count}/{blockCap})
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        blockPercent > 90
                          ? "bg-red-500"
                          : blockPercent > 75
                          ? "bg-yellow-400"
                          : "bg-cyan-400"
                      }`}
                      style={{ width: `${blockPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
