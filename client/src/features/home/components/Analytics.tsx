import { FaCheckCircle } from "react-icons/fa";

export default function Analytics() {
  return (
    <section className="py-16 bg-text text-white overflow-hidden">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left copy */}
          <div className="lg:w-1/2 space-y-6">
            <span className="inline-block bg-primary/20 text-primary px-4 py-1 rounded-full text-xs font-medium border border-primary/30 uppercase tracking-widest">
              Portfolio Analytics
            </span>

            <h2 className="text-4xl font-bold">
              Build a stronger portfolio, not just a prettier one.
            </h2>

            <p className="text-lg text-slate-400">
              Foliora uses industry-standard benchmarks to analyze your content.
              We help you identify gaps that recruiters notice, like missing
              tech stacks or thin project descriptions.
            </p>

            <ul className="space-y-4">
              {[
                {
                  title: "Smart Suggestions",
                  desc: 'AI-powered tips on how to improve your "About Me" and project READMEs.',
                },
                {
                  title: "Recruiter Intent Scores",
                  desc: "Understand how well your portfolio performs for different job roles.",
                },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-4">
                  <FaCheckCircle className="text-success mt-1" />

                  <div>
                    <h5 className="font-semibold text-white">{item.title}</h5>

                    <p className="text-sm text-slate-400">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Analytics Card */}
          <div className="lg:w-1/2 w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md bg-slate-900 p-12 rounded-2xl border border-white/10 shadow-elevated overflow-hidden">
              {/* Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -mr-16 -mt-16" />

              <div className="relative z-10 space-y-8">
                {/* Score */}
                <div className="flex justify-between items-center">
                  <h6 className="text-sm font-medium text-slate-400">
                    Portfolio Health
                  </h6>

                  <span className="font-mono text-success text-2xl font-semibold">
                    82/100
                  </span>
                </div>

                {/* Progress */}
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success rounded-full"
                    style={{
                      width: "82%",
                      boxShadow: "0 0 12px rgba(16,185,129,0.5)",
                    }}
                  />
                </div>

                {/* Recommendations */}
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Recommendations
                  </p>

                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-warning">⚠</span>

                      <span className="text-sm text-white">
                        Add Experience section
                      </span>
                    </div>

                    <span className="text-slate-400">›</span>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between opacity-60">
                    <div className="flex items-center gap-4">
                      <FaCheckCircle className="text-success" />

                      <span className="text-sm text-white">GitHub linked</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End card */}
        </div>
      </div>
    </section>
  );
}
