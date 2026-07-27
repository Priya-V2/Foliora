const features = [
  {
    icon: "sync",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    title: "GitHub Project Import",
    description:
      "Import repositories directly from GitHub. We automatically pull descriptions, stars, and languages to populate your portfolio.",
  },
  {
    icon: "edit_square",
    iconBg: "bg-success/10",
    iconColor: "text-success",
    title: "Live Portfolio Builder",
    description: "Edit your portfolio and preview changes instantly.",
  },
  {
    icon: "analytics",
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
    title: "Recruiter-Ready",
    description: "Built around sections recruiters expect.",
  },
];

export default function Features() {
  return (
    <section className="py-16 bg-surface">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-text">
            Everything you need to stand out
          </h2>

          <p className="text-textMuted max-w-xl mx-auto">
            Skip the CSS grid frustration and focus on your projects.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-12 bg-surfaceAlt rounded-2xl border border-border hover:border-primary/30 transition-all group shadow-card"
            >
              <div
                className={`w-12 h-12 ${feature.iconBg} rounded-lg flex items-center justify-center mb-6 ${feature.iconColor}`}
              >
                <span className="material-symbols-outlined">
                  {feature.icon}
                </span>
              </div>

              <h3 className="text-2xl font-semibold text-text mb-2">
                {feature.title}
              </h3>

              <p className="text-textMuted">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
