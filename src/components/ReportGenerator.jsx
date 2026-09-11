import { useState } from "react";

export default function ReportGenerator({ buildings, darkMode }) {
  const [showReport, setShowReport] = useState(false);

  const totalStudents = buildings.reduce(
    (sum, b) => sum + b.students,
    0
  );

  const avgEnergy = Math.round(
    buildings.reduce((sum, b) => sum + parseInt(b.energy), 0) /
      buildings.length
  );

  const avgWater = Math.round(
    buildings.reduce((sum, b) => sum + parseInt(b.water), 0) /
      buildings.length
  );

  const today = new Date().toLocaleString();

  return (
    <div className="mt-8">
      <button
        onClick={() => setShowReport(true)}
        className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition"
      >
        📄 Generate Daily Report
      </button>

      {showReport && (
        <div
          id="daily-campus-report"
          className={`
            mt-6
            border border-cyan-500
            rounded-3xl
            p-8
            shadow-2xl
            transition-colors
            duration-300
            ${
              darkMode
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-900"
            }
          `}
        >
          <h2 className="text-3xl font-bold text-cyan-400">
            GRIET INTELLIGENT CAMPUS
          </h2>

          <p
            className={`mt-2 ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Daily Campus Report
          </p>

          <div className="mt-5 bg-green-500/10 border border-green-500 rounded-2xl p-5 flex justify-between items-center">
            <div>
              <h3 className="text-green-400 font-bold text-xl">
                Campus Health
              </h3>

              <p
                className={`${
                  darkMode ? "text-slate-300" : "text-slate-600"
                }`}
              >
                All critical systems are functioning normally.
              </p>
            </div>

            <div className="text-5xl">✅</div>
          </div>

          <hr
            className={`my-6 ${
              darkMode ? "border-slate-700" : "border-slate-200"
            }`}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
            <div
              className={`
                rounded-2xl p-5 border border-cyan-500
                ${darkMode ? "bg-slate-800" : "bg-slate-50"}
              `}
            >
              <h4
                className={`text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Students
              </h4>

              <p className="text-4xl font-bold text-cyan-400 mt-2">
                {totalStudents}
              </p>
            </div>

            <div
              className={`
                rounded-2xl p-5 border border-yellow-500
                ${darkMode ? "bg-slate-800" : "bg-slate-50"}
              `}
            >
              <h4
                className={`text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Energy
              </h4>

              <p className="text-4xl font-bold text-yellow-400 mt-2">
                {avgEnergy}%
              </p>
            </div>

            <div
              className={`
                rounded-2xl p-5 border border-blue-500
                ${darkMode ? "bg-slate-800" : "bg-slate-50"}
              `}
            >
              <h4
                className={`text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Water
              </h4>

              <p className="text-4xl font-bold text-blue-400 mt-2">
                {avgWater}%
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold text-cyan-300 mb-3">
              Building Summary
            </h3>

            <div className="space-y-2">
              {buildings.map((building) => (
                <div
                  key={building.id}
                  className={`
                    rounded-2xl p-4 mb-3
                    ${
                      darkMode
                        ? "bg-slate-800"
                        : "bg-slate-50 border border-slate-200"
                    }
                  `}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">
                      {building.icon} {building.name}
                    </span>

                    <span className="text-cyan-400 font-bold">
                      {building.energy}
                    </span>
                  </div>

                  <div
                    className={`
                      w-full rounded-full h-2 mt-3
                      ${darkMode ? "bg-slate-700" : "bg-slate-200"}
                    `}
                  >
                    <div
                      className="bg-cyan-400 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: building.energy,
                      }}
                    />
                  </div>

                  <div
                    className={`
                      flex justify-between mt-3 text-sm
                      ${
                        darkMode
                          ? "text-slate-400"
                          : "text-slate-500"
                      }
                    `}
                  >
                    <span>💧 Water: {building.water}</span>
                    <span>👥 {building.students} Students</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 bg-cyan-500/10 border border-cyan-500 rounded-2xl p-5">
            <h3 className="font-bold text-cyan-300 mb-2">
              AI Recommendation
            </h3>

            <p
              className={
                darkMode ? "text-slate-300" : "text-slate-600"
              }
            >
              Engineering Block has the highest energy usage.
              Consider reducing HVAC usage after working hours.
            </p>
          </div>

          <div
            className={`
              mt-5 rounded-2xl p-5
              ${darkMode ? "bg-slate-800" : "bg-slate-50 border border-slate-200"}
            `}
          >
            <div className="flex justify-between">
              <span className="font-semibold">
                AI Confidence Score
              </span>

              <span className="text-green-400 font-bold">
                98%
              </span>
            </div>

            <div
              className={`
                w-full rounded-full h-2 mt-3
                ${darkMode ? "bg-slate-700" : "bg-slate-200"}
              `}
            >
              <div
                className="bg-green-400 h-2 rounded-full"
                style={{
                  width: "98%",
                }}
              />
            </div>
          </div>

          <div
            className={`
              mt-8 border-t pt-5
              flex justify-between items-center
              text-sm
              ${
                darkMode
                  ? "border-slate-700 text-slate-400"
                  : "border-slate-200 text-slate-500"
              }
            `}
          >
            <span>Generated on: {today}</span>

            <span className="text-cyan-400 font-semibold">
              GRIET INTELLIGENT CAMPUS AI Reporting System
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
            <div
              className={`
                rounded-2xl p-5 border
                ${
                  darkMode
                    ? "bg-slate-800 border-slate-700"
                    : "bg-slate-50 border-slate-200"
                }
              `}
            >
              <h3 className="text-cyan-400 font-bold mb-3">
                🌤 Weather
              </h3>

              <div
                className={`space-y-2 ${
                  darkMode ? "text-slate-300" : "text-slate-600"
                }`}
              >
                <div className="flex justify-between">
                  <span>Condition</span>
                  <span>Cloudy</span>
                </div>

                <div className="flex justify-between">
                  <span>Temperature</span>
                  <span>31°C</span>
                </div>

                <div className="flex justify-between">
                  <span>Humidity</span>
                  <span>62%</span>
                </div>
              </div>
            </div>

            <div
              className={`
                rounded-2xl p-5 border
                ${
                  darkMode
                    ? "bg-slate-800 border-slate-700"
                    : "bg-slate-50 border-slate-200"
                }
              `}
            >
              <h3 className="text-cyan-400 font-bold mb-3">
                📋 Report Information
              </h3>

              <div
                className={`space-y-2 ${
                  darkMode ? "text-slate-300" : "text-slate-600"
                }`}
              >
                <div className="flex justify-between">
                  <span>Report Type</span>
                  <span>Daily</span>
                </div>

                <div className="flex justify-between">
                  <span>Generated By</span>
                  <span>GRIET INTELLIGENT CAMPUS AI</span>
                </div>

                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="text-green-400">
                    Completed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}