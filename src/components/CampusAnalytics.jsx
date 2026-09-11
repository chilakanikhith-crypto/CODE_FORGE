import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function CampusAnalytics({ buildings }) {

    const data = buildings.map((b) => ({
        name: b.name,
        Students: parseInt(b.students),
        Energy: parseInt(b.energy),
    }));

    return (
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-700">

            <h2 className="text-2xl font-bold text-cyan-400 mb-6">
                📊 Campus Analytics
            </h2>

            <div className="h-[350px]">

                <ResponsiveContainer width="100%" height="100%">

                    <BarChart data={data}>

                        <XAxis dataKey="name" />

                        <YAxis />

                        <Tooltip />

                        <Bar
                            dataKey="Students"
                            fill="#06b6d4"
                        />

                        <Bar
                            dataKey="Energy"
                            fill="#f97316"
                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
}