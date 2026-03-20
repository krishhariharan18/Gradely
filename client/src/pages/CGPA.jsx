import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function getMotivation(value) {
  if (value >= 9.5) return "Outstanding Performance! 🌟";
  if (value >= 8.5) return "Excellent Work! 🎯";
  if (value >= 7.5) return "Great Job! 👍";
  if (value >= 6.5) return "Good Performance 😊";
  if (value >= 5.0) return "Keep Pushing 💪";
  return "Needs Improvement 📚";
}

function CGPA() {
  const [semesterCount, setSemesterCount] = useState(1);
  const [gpaValues, setGpaValues] = useState({});

  const chartData = useMemo(() => {
    return Array.from({ length: semesterCount }, (_, i) => {
      const semester = i + 1;
      const value = Number(gpaValues[semester]);
      const gpa = Number.isFinite(value) ? Math.max(0, Math.min(10, value)) : 0;
      return { name: `Sem ${semester}`, gpa };
    });
  }, [semesterCount, gpaValues]);

  const stats = useMemo(() => {
    const values = chartData.map((item) => item.gpa);
    const cgpa = values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : 0;

    let improvements = 0;
    let declines = 0;

    for (let i = 1; i < values.length; i += 1) {
      if (values[i] > values[i - 1]) improvements += 1;
      if (values[i] < values[i - 1]) declines += 1;
    }

    const lastThree = values.slice(-3);
    let trend = "🔵 Stable";

    if (lastThree.length >= 3) {
      if (lastThree[2] > lastThree[1] && lastThree[1] > lastThree[0]) trend = "📈 Improving";
      else if (lastThree[2] < lastThree[1] && lastThree[1] < lastThree[0]) trend = "📉 Declining";
    }

    return {
      cgpa,
      highest: values.length ? Math.max(...values) : 0,
      lowest: values.length ? Math.min(...values) : 0,
      improvements,
      declines,
      trend,
    };
  }, [chartData]);

  return (
    <section className="page-enter">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold sm:text-4xl">📊 CGPA Calculator</h1>
      </header>

      <div className="mb-6 glass-card">
        <label className="mb-2 block text-sm text-white/70">Till which semester?</label>
        <select
          className="field max-w-xs"
          value={semesterCount}
          onChange={(e) => setSemesterCount(Number(e.target.value))}
        >
          {Array.from({ length: 8 }, (_, i) => i + 1).map((sem) => (
            <option key={sem} value={sem}>
              {sem}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="glass-card glow-hover">
            <h2 className="mb-4 text-xl font-bold">Semester GPA Inputs</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: semesterCount }, (_, i) => i + 1).map((sem) => (
                <div key={sem}>
                  <label className="mb-2 block text-sm text-white/70">Semester {sem} GPA</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.01"
                    placeholder="0.00"
                    className="field"
                    value={gpaValues[sem] ?? ""}
                    onChange={(e) => {
                      const raw = e.target.value;
                      setGpaValues((prev) => ({ ...prev, [sem]: raw }));
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card glow-hover">
            <h2 className="mb-4 text-xl font-bold">Performance Analysis</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="cgpaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#00e5ff" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#d4d4d8" />
                  <YAxis domain={[0, 10]} stroke="#d4d4d8" />
                  <Tooltip contentStyle={{ background: "#130b26", border: "1px solid rgba(255,255,255,0.2)" }} />
                  <Area
                    type="monotone"
                    dataKey="gpa"
                    stroke="#00e5ff"
                    strokeWidth={3}
                    fill="url(#cgpaGradient)"
                    dot={{ fill: "#c724b1", r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="glass-card text-center">
              <p className="text-sm text-white/60">Highest GPA</p>
              <p className="mt-2 text-2xl font-bold text-cyanAccent">{stats.highest.toFixed(2)}</p>
            </div>
            <div className="glass-card text-center">
              <p className="text-sm text-white/60">Lowest GPA</p>
              <p className="mt-2 text-2xl font-bold text-pinkAccent">{stats.lowest.toFixed(2)}</p>
            </div>
            <div className="glass-card text-center">
              <p className="text-sm text-white/60">Improvements</p>
              <p className="mt-2 text-2xl font-bold text-cyanAccent">{stats.improvements}</p>
            </div>
            <div className="glass-card text-center">
              <p className="text-sm text-white/60">Declines</p>
              <p className="mt-2 text-2xl font-bold text-pinkAccent">{stats.declines}</p>
            </div>
          </div>
        </div>

        <aside className="glass-card glow-hover h-fit">
          <h2 className="text-xl font-bold">CGPA Overview</h2>
          <p className="mt-4 text-sm text-white/60">Current CGPA</p>
          <p className="calc-value mt-1 text-5xl font-extrabold">{stats.cgpa.toFixed(2)}</p>
          <p className="mt-3 text-white/80">{getMotivation(stats.cgpa)}</p>

          <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyanAccent transition-all duration-500"
              style={{ width: `${Math.max(0, Math.min(100, (stats.cgpa / 10) * 100))}%` }}
            />
          </div>

          <p className="mt-5 inline-block rounded-full border border-white/20 px-3 py-1 text-sm text-white/80">
            Overall Trend: {stats.trend}
          </p>
        </aside>
      </div>
    </section>
  );
}

export default CGPA;
