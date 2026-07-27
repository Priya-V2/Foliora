const logos = ["VERCEL", "GITHUB", "STRIPE", "LINEAR", "FIGMA"];

export default function LogosBar() {
  return (
    <section className="py-12 bg-background border-y border-border">
      <div className="container text-center">
        <p className="text-sm text-textMuted mb-6">
          Built for developers, freelancers and job seekers at leading companies
        </p>

        <div className="flex flex-wrap justify-center items-center gap-16 opacity-40 grayscale">
          {logos.map((logo) => (
            <span
              key={logo}
              className="text-2xl font-extrabold tracking-tighter text-text"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
