export default function SystemHealth({ buildings }) {

  const avgEnergy =
    buildings.reduce((sum, b) => sum + parseInt(b.energy), 0) /
    buildings.length;

  const avgStudents =
    buildings.reduce((sum, b) => sum + parseInt(b.students), 0) /
    buildings.length;

  const alerts = buildings.filter(
    (b) => parseInt(b.energy) > 80
  ).length;

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-700 p-6">

      <h2 className="text-2xl font-bold text-cyan-400 mb-6">
        🩺 System Health
      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-slate-800 rounded-2xl p-5">

          <h3 className="text-slate-400 text-sm">
            Average Energy
          </h3>

          <p className="text-4xl font-bold text-orange-400 mt-2">
            {avgEnergy.toFixed(0)}%
          </p>

        </div>

        <div className="bg-slate-800 rounded-2xl p-5">

          <h3 className="text-slate-400 text-sm">
            Avg Students
          </h3>

          <p className="text-4xl font-bold text-cyan-400 mt-2">
            {avgStudents.toFixed(0)}
          </p>

        </div>

        <div className="bg-slate-800 rounded-2xl p-5">

          <h3 className="text-slate-400 text-sm">
            Active Alerts
          </h3>

          <p className="text-4xl font-bold text-red-400 mt-2">
            {alerts}
          </p>

        </div>

      </div>

    </div>
  );
}