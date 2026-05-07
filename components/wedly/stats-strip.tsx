const stats = [
  { icon: "♡", value: "1200+", label: "Wishes Sent" },
  { icon: "✉", value: "467+", label: "RSVP Collected" },
  { icon: "◫", value: "89+", label: "Wedding Pages" },
  { icon: "◷", value: "1-Min", label: "Setup" },
];

export function StatsStrip() {
  return (
    <section className="section-shell relative z-20 -mt-20">
      <div className="rounded-[30px] border border-rose/12 bg-cream px-5 py-8 shadow-[0_22px_46px_rgba(58,36,28,0.16)] md:px-10">
        <div className="grid grid-cols-2 gap-y-8 md:grid-cols-4 md:divide-x md:divide-rose/18">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center md:px-8">
              <div className="text-3xl text-rose">{stat.icon}</div>
              <p className="mt-3 text-5xl leading-none font-serif text-terracotta">
                {stat.value}
              </p>
              <p className="mt-2 text-lg font-medium text-deep">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
