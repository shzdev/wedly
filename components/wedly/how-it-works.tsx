const steps = [
  {
    id: "1",
    icon: "✎",
    title: "Create Your Page",
    description: "Add your wedding details, message, and theme in just a few clicks.",
  },
  {
    id: "2",
    icon: "⤴",
    title: "Share With Guests",
    description: "We'll generate a unique link. Share it via WhatsApp, social media, or anywhere.",
  },
  {
    id: "3",
    icon: "♡",
    title: "Collect RSVPs & Wishes",
    description: "View responses, manage your guests, and read their beautiful wishes in one place.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-rose/10 bg-cream/50 py-20">
      <div className="section-shell">
        <p className="text-center text-xs font-semibold tracking-[0.34em] uppercase text-terracotta">
          How It Works
        </p>
        <h2 className="mt-4 text-center text-6xl text-deep">Three Simple Steps</h2>
        <div className="relative mt-14 grid gap-8 md:grid-cols-3">
          <div className="pointer-events-none absolute top-10 left-0 hidden h-px w-full bg-[linear-gradient(to_right,transparent,#d2b8a9,transparent)] md:block" />
          {steps.map((step) => (
            <article key={step.id} className="relative text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-rose/30 bg-cream text-2xl text-terracotta shadow-sm">
                {step.icon}
              </div>
              <p className="mt-2 text-sm font-semibold text-terracotta">{step.id}</p>
              <h3 className="mt-2 text-3xl text-terracotta">{step.title}</h3>
              <p className="mx-auto mt-3 max-w-[280px] text-base leading-relaxed text-muted">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
