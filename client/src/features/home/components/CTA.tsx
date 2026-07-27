export default function CTA() {
  return (
    <section className="container mb-16">
      <div className="bg-primary text-white p-16 rounded-4xl text-center relative overflow-hidden shadow-elevated">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)] pointer-events-none" />

        <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
          <h2 className="text-5xl font-extrabold leading-none">
            Ready to land your next role?
          </h2>

          <p className="text-lg text-white/80">
            Join 15,000+ developers who built their professional presence with
            Foliora.
          </p>

          <div className="pt-4">
            <button className="bg-surface text-primary px-16 py-4 rounded-xl text-2xl font-bold shadow-card hover:scale-105 transition-all">
              Launch your portfolio today
            </button>
          </div>

          <p className="text-xs opacity-60">
            No credit card required. Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
