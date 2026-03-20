import { useMemo, useState } from "react";

const gradeThresholds = [
  { grade: "O", min: 91, max: 100, color: "bg-cyanAccent" },
  { grade: "A+", min: 81, max: 90, color: "bg-fuchsia-400" },
  { grade: "A", min: 71, max: 80, color: "bg-violet-400" },
  { grade: "B+", min: 61, max: 70, color: "bg-blue-400" },
  { grade: "B", min: 51, max: 60, color: "bg-emerald-400" },
  { grade: "P", min: 41, max: 50, color: "bg-amber-400" },
  { grade: "RA", min: 0, max: 40, color: "bg-rose-400" },
];

const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

function RequiredESE() {
  const [ia1Obtained, setIa1Obtained] = useState("");
  const [ia1OutOf, setIa1OutOf] = useState("");
  const [mse, setMse] = useState("");
  const [ia2Obtained, setIa2Obtained] = useState("");
  const [ia2OutOf, setIa2OutOf] = useState("");

  // Scales each assessment component into final weightage.
  const ia1Scaled = useMemo(() => {
    const outOf = safeNumber(ia1OutOf);
    if (outOf <= 0) return 0;
    return (safeNumber(ia1Obtained) / outOf) * 10;
  }, [ia1Obtained, ia1OutOf]);

  const mseScaled = useMemo(() => {
    return (safeNumber(mse) / 50) * 30;
  }, [mse]);

  const ia2Scaled = useMemo(() => {
    const outOf = safeNumber(ia2OutOf);
    if (outOf <= 0) return 0;
    return (safeNumber(ia2Obtained) / outOf) * 10;
  }, [ia2Obtained, ia2OutOf]);

  const currentTotal = ia1Scaled + mseScaled + ia2Scaled;

  return (
    <section className="page-enter space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-extrabold sm:text-4xl">🎯 Required ESE Marks</h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card glow-hover">
          <h2 className="mb-5 text-xl font-bold">Enter Your Marks</h2>

          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-black/10 p-4">
              <p className="mb-3 font-semibold">IA1</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="field"
                  type="number"
                  placeholder="Marks Obtained"
                  value={ia1Obtained}
                  onChange={(e) => setIa1Obtained(e.target.value)}
                />
                <input
                  className="field"
                  type="number"
                  placeholder="Out of"
                  value={ia1OutOf}
                  onChange={(e) => setIa1OutOf(e.target.value)}
                />
              </div>
              <p className="mt-3 text-sm text-white/70">
                Scaled /10: <span className="calc-value font-semibold">{ia1Scaled.toFixed(2)}</span>
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/10 p-4">
              <p className="mb-3 font-semibold">MSE</p>
              <input
                className="field"
                type="number"
                placeholder="Marks /50"
                value={mse}
                onChange={(e) => setMse(e.target.value)}
              />
              <p className="mt-3 text-sm text-white/70">
                Scaled /30: <span className="calc-value font-semibold">{mseScaled.toFixed(2)}</span>
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/10 p-4">
              <p className="mb-3 font-semibold">IA2</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="field"
                  type="number"
                  placeholder="Marks Obtained"
                  value={ia2Obtained}
                  onChange={(e) => setIa2Obtained(e.target.value)}
                />
                <input
                  className="field"
                  type="number"
                  placeholder="Out of"
                  value={ia2OutOf}
                  onChange={(e) => setIa2OutOf(e.target.value)}
                />
              </div>
              <p className="mt-3 text-sm text-white/70">
                Scaled /10: <span className="calc-value font-semibold">{ia2Scaled.toFixed(2)}</span>
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-pinkAccent/40 bg-pinkAccent/10 p-4 text-center">
            <p className="text-sm text-white/80">Current Total (IA1 + MSE + IA2)</p>
            <p className="mt-2 text-2xl font-bold text-cyanAccent">{currentTotal.toFixed(2)} / 50</p>
          </div>
        </div>

        <div className="glass-card glow-hover">
          <h2 className="mb-5 text-xl font-bold">Required ESE for Each Grade</h2>
          <div className="space-y-3">
            {gradeThresholds.map((item) => {
              const requiredEse = (item.min - currentTotal) * 2;
              const requiredScaledEse = requiredEse / 2;

              let valueText = `${Math.max(0, requiredEse).toFixed(2)} /100 (${Math.max(
                0,
                requiredScaledEse
              ).toFixed(2)} /50 scaled)`;
              let valueColor = "text-cyanAccent";

              if (currentTotal >= item.min) {
                valueText = "Already Achieved ✓";
                valueColor = "text-emerald-400";
              } else if (requiredEse > 100) {
                valueText = "Not Achievable ✗";
                valueColor = "text-rose-400";
              }

              return (
                <div key={item.grade} className="rounded-xl border border-white/10 bg-black/10 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`h-9 w-9 rounded-full ${item.color} shadow-md`} />
                      <div>
                        <p className="font-bold">{item.grade}</p>
                        <p className="text-sm text-white/60">
                          Total range: {item.min} - {item.max}
                        </p>
                      </div>
                    </div>
                    <p className={`text-right text-sm font-semibold ${valueColor}`}>{valueText}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <p className="glass-card text-sm text-white/75">
        Note: ESE is conducted for 100 marks and scaled to 50 marks for final grade calculation.
        Total = IA1(10) + MSE(30) + IA2(10) + ESE(50) = 100
      </p>
    </section>
  );
}

export default RequiredESE;
