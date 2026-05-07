const bullets = [
  "Beautiful & Elegant Design",
  "Collect RSVPs & Wishes",
  "Easy to Share & Manage",
];

const colors = ["#B36F58", "#E39D95", "#839B7E", "#DFC7B0", "#B67B8E", "#7C92A5"];

export function CreateEventForm() {
  return (
    <section className="relative py-24">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.9fr_1.25fr] lg:items-start">
        <div className="pt-8">
          <p className="text-xs font-semibold tracking-[0.35em] uppercase text-terracotta">
            Get Started
          </p>
          <h2 className="mt-4 max-w-[430px] text-6xl leading-tight text-deep">
            Create Your Wedly Page in Seconds
          </h2>
          <p className="mt-7 max-w-[420px] text-xl leading-relaxed text-muted">
            Fill in a few details and we&apos;ll create a stunning wedding RSVP page
            that you can share with your guests.
          </p>
          <ul className="mt-10 space-y-5">
            {bullets.map((item) => (
              <li key={item} className="flex items-center gap-4 text-base font-semibold text-terracotta">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-rose/60 text-sm">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-10 h-32 w-32 rounded-full border-2 border-sand/70" />
        </div>

        <div className="rounded-[26px] bg-cream p-9 shadow-[0_20px_42px_rgba(58,36,28,0.14)]">
          <h3 className="text-5xl text-terracotta">Create Your Wedding Page</h3>
          <form className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-deep">Couple Name</span>
              <input
                className="h-13 w-full rounded-xl border border-rose/20 bg-[#fbf7f3] px-4 text-base outline-none ring-0 placeholder:text-muted/55 focus:border-terracotta"
                placeholder="e.g. Aisyah & Hafiz"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-deep">Wedding Date</span>
                <input
                  className="h-13 w-full rounded-xl border border-rose/20 bg-[#fbf7f3] px-4 text-base placeholder:text-muted/55 focus:border-terracotta focus:outline-none"
                  placeholder="Select date"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-deep">Venue</span>
                <input
                  className="h-13 w-full rounded-xl border border-rose/20 bg-[#fbf7f3] px-4 text-base placeholder:text-muted/55 focus:border-terracotta focus:outline-none"
                  placeholder="e.g. Putrajaya Marriott Hotel"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-deep">Short Message (Optional)</span>
              <textarea
                className="h-28 w-full resize-none rounded-xl border border-rose/20 bg-[#fbf7f3] p-4 text-base placeholder:text-muted/55 focus:border-terracotta focus:outline-none"
                placeholder="Share a short message for your guests..."
              />
            </label>

            <div>
              <p className="mb-3 text-sm font-semibold text-deep">Theme Color</p>
              <div className="flex flex-wrap gap-4">
                {colors.map((color, index) => (
                  <button
                    key={color}
                    className={`h-10 w-10 rounded-full border-2 ${
                      index === 0 ? "border-terracotta" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Theme color ${index + 1}`}
                    type="button"
                  />
                ))}
              </div>
            </div>

            <button
              className="mt-4 flex h-14 w-full items-center justify-center rounded-xl bg-terracotta text-base font-semibold text-cream shadow-[0_12px_28px_rgba(169,110,88,0.45)] transition hover:bg-rose"
              type="button"
            >
              Create My Wedding Page
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
