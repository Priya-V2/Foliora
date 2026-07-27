type Step = {
  number: string;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    number: "Step 01",
    title: "Connect GitHub",
    description:
      "One-click secure OAuth integration to fetch your public and private repo metadata.",
  },
  {
    number: "Step 02",
    title: "Choose a Template",
    description:
      "Select from a library of minimalist, developer-centric layouts designed for high performance.",
  },
  {
    number: "Step 03",
    title: "Customize",
    description:
      "Fine-tune your content, add custom domains, and choose your preferred brand colors.",
  },
  {
    number: "Step 04",
    title: "Publish",
    description:
      "Hit deploy. Your portfolio is hosted on our globally distributed edge network with free SSL.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-background overflow-hidden">
      <div className="container">
        <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-16">
          <div className="max-w-xl">
            <h2 className="text-4xl font-bold text-text mb-4">
              From code to live portfolio in minutes.
            </h2>

            <p className="text-textMuted">
              Stop spending weekends fighting with React frameworks. Connect,
              pick, and publish.
            </p>
          </div>

          <div className="hidden md:flex gap-2">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <span className="w-3 h-3 rounded-full bg-border" />
            <span className="w-3 h-3 rounded-full bg-border" />
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number}>
              <div className="space-y-4">
                <div className="font-mono text-primary text-xs uppercase tracking-widest">
                  {step.number}
                </div>

                <h4 className="text-2xl font-semibold text-text">
                  {step.title}
                </h4>

                <p className="text-sm text-textMuted">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
