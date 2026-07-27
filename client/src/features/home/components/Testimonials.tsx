type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
  avatarBg: string;
  avatarText: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "I spent 3 hours trying to setup a Next.js portfolio and gave up. With Foliora, I was done in 15 minutes. The templates are actually good.",
    name: "Sarah Chen",
    role: "Junior Frontend Developer",
    initials: "SC",
    avatarBg: "bg-primary/20",
    avatarText: "text-primary",
  },
  {
    quote:
      "The GitHub integration is seamless. It automatically synced my new side project while I was sleeping. Truly developer-first.",
    name: "Marcus Knight",
    role: "Fullstack Engineer",
    initials: "MK",
    avatarBg: "bg-secondary/20",
    avatarText: "text-secondary",
  },
  {
    quote:
      "The portfolio analytics revealed I hadn't mentioned my AWS skills anywhere. Added it, and got two interview calls the next week.",
    name: "Jordan Lee",
    role: "Freelance Developer",
    initials: "JL",
    avatarBg: "bg-tertiary/20",
    avatarText: "text-tertiary",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-surface">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-text">
            Loved by developers everywhere.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-12 bg-surfaceAlt rounded-2xl border border-border italic text-textMuted flex flex-col justify-between shadow-card"
            >
              <p className="mb-12">&ldquo;{t.quote}&rdquo;</p>

              <div className="flex items-center gap-4 not-italic">
                <div
                  className={`w-10 h-10 rounded-full ${t.avatarBg} flex items-center justify-center font-bold ${t.avatarText}`}
                >
                  {t.initials}
                </div>

                <div>
                  <div className="text-sm font-medium text-text">{t.name}</div>

                  <div className="text-xs text-textMuted">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
