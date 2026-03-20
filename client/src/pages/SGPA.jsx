import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const academicYears = ["2023-2024", "2024-2025", "2025-2026", "2026-2027"];

function getMotivation(value) {
  if (value >= 9.5) return "Outstanding Performance! 🌟";
  if (value >= 8.5) return "Excellent Work! 🎯";
  if (value >= 7.5) return "Great Job! 👍";
  if (value >= 6.5) return "Good Performance 😊";
  if (value >= 5.0) return "Keep Pushing 💪";
  return "Needs Improvement 📚";
}

function SGPA() {
  const [programs, setPrograms] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [program, setProgram] = useState("");
  const [semester, setSemester] = useState("");
  const [academicYear, setAcademicYear] = useState(academicYears[0]);
  const [selectedGrades, setSelectedGrades] = useState({});

  const [metaLoading, setMetaLoading] = useState(true);
  const [subjectLoading, setSubjectLoading] = useState(false);

  // Load dropdown metadata once on mount.
  useEffect(() => {
    const loadMeta = async () => {
      try {
        setMetaLoading(true);
        const [programRes, semesterRes, gradeRes] = await Promise.all([
          fetch(`${API_BASE}/programs`),
          fetch(`${API_BASE}/semesters`),
          fetch(`${API_BASE}/grades`),
        ]);

        const [programJson, semesterJson, gradeJson] = await Promise.all([
          programRes.json(),
          semesterRes.json(),
          gradeRes.json(),
        ]);

        const fetchedPrograms = programJson.data || [];
        const fetchedSemesters = semesterJson.data || [];

        setPrograms(fetchedPrograms);
        setSemesters(fetchedSemesters);
        setGrades(gradeJson.data || []);

        if (fetchedPrograms[0]) setProgram(String(fetchedPrograms[0].id));
        if (fetchedSemesters[0]) setSemester(String(fetchedSemesters[0].id));
      } catch (error) {
        console.error("Failed to load SGPA metadata:", error);
      } finally {
        setMetaLoading(false);
      }
    };

    loadMeta();
  }, []);

  // Reload subjects whenever program or semester changes.
  useEffect(() => {
    if (!program || !semester) return;

    const loadSubjects = async () => {
      try {
        setSubjectLoading(true);
        const res = await fetch(`${API_BASE}/subjects?program=${program}&semester=${semester}`);
        const json = await res.json();
        setSubjects(json.data || []);
        setSelectedGrades({});
      } catch (error) {
        console.error("Failed to load subjects:", error);
        setSubjects([]);
      } finally {
        setSubjectLoading(false);
      }
    };

    loadSubjects();
  }, [program, semester]);

  const gradePointMap = useMemo(() => {
    const map = new Map();
    grades.forEach((grade) => {
      map.set(Number(grade.grade_point), grade.grade_letter);
    });
    return map;
  }, [grades]);

  // Compute SGPA live using current selected grade points.
  const sgpa = useMemo(() => {
    let weighted = 0;
    let totalCredits = 0;

    subjects.forEach((subject) => {
      const credit = Number(subject.credits) || 0;
      const gp = Number(selectedGrades[subject.id]);

      if (Number.isFinite(gp)) {
        weighted += credit * gp;
        totalCredits += credit;
      }
    });

    if (!totalCredits) return 0;
    return weighted / totalCredits;
  }, [subjects, selectedGrades]);

  const distribution = useMemo(() => {
    const counts = { O: 0, "A+": 0, A: 0, "B+": 0, B: 0, P: 0, RA: 0 };

    Object.values(selectedGrades).forEach((value) => {
      const gradeLetter = gradePointMap.get(Number(value));
      if (gradeLetter && counts[gradeLetter] !== undefined) {
        counts[gradeLetter] += 1;
      }
    });

    return counts;
  }, [selectedGrades, gradePointMap]);

  return (
    <section className="page-enter">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold sm:text-4xl">🎓 SGPA Calculator</h1>
        <p className="mt-2 text-white/70">Select your semester details and enter grades to calculate SGPA instantly.</p>
      </header>

      <div className="glass-card mb-6 grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm text-white/70">Program</label>
          <select className="field" value={program} onChange={(e) => setProgram(e.target.value)}>
            {programs.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-white/70">Semester</label>
          <select className="field" value={semester} onChange={(e) => setSemester(e.target.value)}>
            {semesters.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-white/70">Academic Year</label>
          <select className="field" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)}>
            {academicYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {metaLoading ? (
        <div className="glass-card flex items-center justify-center gap-3 py-10 text-white/80">
          <span className="spinner" /> Loading program, semester and grade data...
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass-card glow-hover">
            <h2 className="mb-4 text-xl font-bold">Enter Grades</h2>

            {subjectLoading ? (
              <div className="flex items-center justify-center gap-3 py-10 text-white/80">
                <span className="spinner" /> Fetching subjects...
              </div>
            ) : subjects.length === 0 ? (
              <p className="text-white/70">No subjects found for selected program and semester.</p>
            ) : (
              <div className="space-y-3">
                {subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="rounded-xl border border-white/10 bg-black/10 p-3 sm:flex sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-white">{subject.name}</p>
                      <p className="text-sm text-white/60">Credits: {subject.credits}</p>
                    </div>

                    <select
                      className="field mt-2 sm:mt-0 sm:w-40"
                      value={selectedGrades[subject.id] ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedGrades((prev) => ({
                          ...prev,
                          [subject.id]: value === "" ? "" : Number(value),
                        }));
                      }}
                    >
                      <option value="">Select Grade</option>
                      <option value="10">O (10)</option>
                      <option value="9">A+ (9)</option>
                      <option value="8">A (8)</option>
                      <option value="7">B+ (7)</option>
                      <option value="6">B (6)</option>
                      <option value="5">P (5)</option>
                      <option value="0">RA (0)</option>
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card glow-hover">
            <h2 className="mb-4 text-xl font-bold">Your SGPA</h2>
            <p className="text-white/70">↗ trend icon</p>
            <p className="mt-3 text-sm uppercase tracking-wide text-white/60">Your SGPA is</p>
            <p className="calc-value mt-1 text-5xl font-extrabold">{sgpa.toFixed(2)}</p>
            <p className="mt-3 text-white/90">{getMotivation(sgpa)}</p>

            <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyanAccent transition-all duration-500"
                style={{ width: `${Math.max(0, Math.min(100, (sgpa / 10) * 100))}%` }}
              />
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-black/10 p-4">
              <h3 className="mb-3 text-lg font-semibold">Grade Distribution</h3>
              <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                {Object.entries(distribution).map(([grade, count]) => (
                  <p key={grade} className="text-white/80">
                    {grade} : <span className="calc-value font-semibold">{count} courses</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default SGPA;
