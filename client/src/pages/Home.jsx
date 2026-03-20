import { Link } from "react-router-dom";

const features = [
  {
    title: "SGPA Calculator",
    icon: "🎓",
    desc: "Calculate your semester GPA instantly",
    to: "/sgpa",
    iconBg: "bg-teal-500/25",
  },
  {
    title: "CGPA Calculator",
    icon: "📊",
    desc: "Track your cumulative GPA across semesters",
    to: "/cgpa",
    iconBg: "bg-pink-500/25",
  },
  {
    title: "Required ESE Marks",
    icon: "🎯",
    desc: "Find out what you need in your end sem",
    to: "/required-ese",
    iconBg: "bg-orange-500/25",
  },
  {
    title: "Expected Grade",
    icon: "🏆",
    desc: "Predict your final grade before results",
    to: "/expected-grade",
    iconBg: "bg-emerald-500/25",
  },
];

function Home() {
  return (
    <section className="page-enter flex min-h-[calc(100vh-7rem)] flex-col justify-between">
      <div className="py-10 text-center">
        <h1 className="bg-gradient-to-r from-cyanAccent via-sky-300 to-purple-400 bg-clip-text text-6xl font-extrabold text-transparent sm:text-7xl md:text-8xl">
          Gradely
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-base text-white/80 sm:text-lg">
          Your ultimate academic companion for tracking grades, calculating GPA, and achieving
          your academic goals.
        </p>

        <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2">
          {features.map((feature) => (
            <Link
              to={feature.to}
              key={feature.title}
              className="glass-card glow-hover group flex items-start gap-4 text-left"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${feature.iconBg}`}
              >
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyanAccent">
                  {feature.title}
                </h3>
                <p className="mt-1 text-white/70">{feature.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <footer className="mt-10 flex flex-col gap-2 border-t border-white/10 py-5 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
        <p>Gradely - Your academic companion</p>
        <p>© 2026 Gradely. All rights reserved. Made with ❤️ for students</p>
      </footer>
    </section>
  );
}

export default Home;
