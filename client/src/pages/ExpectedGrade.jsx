import { useMemo, useState } from "react";

const gradeRanges = [
  { grade: "O", min: 91, max: 100 },
  { grade: "A+", min: 81, max: 90 },
  { grade: "A", min: 71, max: 80 },
  { grade: "B+", min: 61, max: 70 },
  { grade: "B", min: 51, max: 60 },
  { grade: "P", min: 41, max: 50 },
  { grade: "RA", min: 0, max: 40 },
];

const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

function getMotivation(value) {
  if (value >= 9.5) return "Outstanding Performance! 🌟";
  if (value >= 8.5) return "Excellent Work! 🎯";
  if (value >= 7.5) return "Great Job! 👍";
  if (value >= 6.5) return "Good Performance 😊";
  if (value >= 5.0) return "Keep Pushing 💪";
  return "Needs Improvement 📚";
}

function getGrade(total) {
  const found = gradeRanges.find((range) => total >= range.min && total <= range.max);
  return found?.grade || "RA";
}

function ExpectedGrade() {
  const [ia1Eval, setIa1Eval] = useState("");
  const [ia1OutOf, setIa1OutOf] = useState("");
  const [mse, setMse] = useState("");
  const [ia2Eval, setIa2Eval] = useState("");
  const [ia2OutOf, setIa2OutOf] = useState("");
  const [ese, setEse] = useState("");

  // Converts user-entered marks into weighted contribution out of 100.
  const ia1Scaled = useMemo(() => {
    const outOf = safeNumber(ia1OutOf);
    if (outOf <= 0) return 0;
    return (safeNumber(ia1Eval) / outOf) * 10;
  }, [ia1Eval, ia1OutOf]);

  const mseScaled = useMemo(() => {
    return (safeNumber(mse) / 50) * 30;
  }, [mse]);

  const ia2Scaled = useMemo(() => {
    const outOf = safeNumber(ia2OutOf);
    if (outOf <= 0) return 0;
    return (safeNumber(ia2Eval) / outOf) * 10;
  }, [ia2Eval, ia2OutOf]);

  const eseScaled = useMemo(() => {
    return (safeNumber(ese) / 100) * 50;
  }, [ese]);

  const total = ia1Scaled + mseScaled + ia2Scaled + eseScaled;
  const grade = getGrade(total);

  return (
    <section className="page-enter space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-extrabold sm:text-4xl">🏆 Expected Grade Calculator</h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card glow-hover">
          <h2 className="mb-5 text-xl font-bold">Enter Your Marks</h2>

          <div className="space-y-4">
            <div>
              <p className="mb-2 font-semibold">IA1</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="field"
                  type="number"
                  placeholder="Evaluated"
                  value={ia1Eval}
                  onChange={(e) => setIa1Eval(e.target.value)}
                />
                <input
                  className="field"
                  type="number"
                  placeholder="Out of"
                  value={ia1OutOf}
                  onChange={(e) => setIa1OutOf(e.target.value)}
                />
              </div>
              <p className="mt-2 text-sm text-white/70">
                Scaled /10: <span className="calc-value font-semibold">{ia1Scaled.toFixed(2)}</span>
              </p>
            </div>

            <div>
              <p className="mb-2 font-semibold">MSE</p>
              <input
                className="field"
                type="number"
                placeholder="Marks /50"
                value={mse}
                onChange={(e) => setMse(e.target.value)}
              />
              <p className="mt-2 text-sm text-white/70">
                Scaled /30: <span className="calc-value font-semibold">{mseScaled.toFixed(2)}</span>
              </p>
            </div>

            <div>
              <p className="mb-2 font-semibold">IA2</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="field"
                  type="number"
                  placeholder="Evaluated"
                  value={ia2Eval}
                  onChange={(e) => setIa2Eval(e.target.value)}
                />
                <input
                  className="field"
                  type="number"
                  placeholder="Out of"
                  value={ia2OutOf}
                  onChange={(e) => setIa2OutOf(e.target.value)}
                />
              </div>
              <p className="mt-2 text-sm text-white/70">
                Scaled /10: <span className="calc-value font-semibold">{ia2Scaled.toFixed(2)}</span>
              </p>
            </div>

            <div>
              <p className="mb-2 font-semibold">ESE</p>
              <input
                className="field"
                type="number"
                placeholder="Marks /100"
                value={ese}
                onChange={(e) => setEse(e.target.value)}
              />
              <p className="mt-2 text-sm text-white/70">
                Scaled /50: <span className="calc-value font-semibold">{eseScaled.toFixed(2)}</span>
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-pinkAccent/40 bg-pinkAccent/10 p-4 text-center">
            <p className="text-sm text-white/70">Final Total</p>
            <p className="mt-1 text-3xl font-extrabold text-pinkAccent">{total.toFixed(2)} / 100</p>
          </div>
        </div>

        <div className="glass-card glow-hover">
          <h2 className="mb-5 text-xl font-bold">Your Expected Grade</h2>

          <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-cyanAccent via-sky-400 to-pinkAccent p-[3px]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#150c2c] text-3xl font-extrabold text-cyanAccent">
              {grade}
            </div>
          </div>

          <p className="text-center text-2xl font-bold">Grade: {grade}</p>
          <p className="mt-2 text-center text-white/80">{getMotivation(total / 10)}</p>

          <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyanAccent transition-all duration-500"
              style={{ width: `${Math.max(0, Math.min(100, total))}%` }}
            />
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-black/10 p-4">
            <h3 className="mb-3 text-lg font-semibold">Marks Breakdown</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-white/80">
              <p>IA1</p>
              <p className="text-right calc-value">{ia1Scaled.toFixed(2)}</p>
              <p>MSE</p>
              <p className="text-right calc-value">{mseScaled.toFixed(2)}</p>
              <p>IA2</p>
              <p className="text-right calc-value">{ia2Scaled.toFixed(2)}</p>
              <p>ESE</p>
              <p className="text-right calc-value">{eseScaled.toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-black/10 p-4 text-sm text-white/80">
            <h3 className="mb-2 text-base font-semibold">Grade Reference</h3>
            <p>O: 91-100 | A+: 81-90 | A: 71-80 | B+: 61-70</p>
            <p className="mt-1">B: 51-60 | P: 41-50 | RA: 0-40</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExpectedGrade;
