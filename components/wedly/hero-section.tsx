import { Navbar } from "@/components/site/navbar";

export function HeroSection() {
  return (
    <section className="relative min-h-[760px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/wedly-reference.png')" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(35,20,13,0.92)_8%,rgba(35,20,13,0.7)_40%,rgba(35,20,13,0.4)_70%,rgba(35,20,13,0.55)_100%)]" />
      <Navbar />
      <div className="section-shell relative z-10 pt-20 pb-40 text-cream md:pt-24">
        <div className="max-w-[580px]">
          <p className="mb-6 text-xs font-semibold tracking-[0.36em] uppercase text-cream/90">
            Luxury Wedding RSVP Experience
          </p>
          <h1 className="text-5xl leading-[0.98] font-semibold md:text-7xl">
            Create Your Wedding RSVP Page In Minutes
          </h1>
          <p className="mt-7 max-w-[520px] text-[23px] leading-relaxed text-cream/85">
            A beautiful way to collect RSVPs, guest wishes, and wedding details
            through one elegant shareable page.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <button className="rounded-xl bg-terracotta px-9 py-4 text-base font-semibold text-cream shadow-[0_16px_34px_rgba(169,110,88,0.45)]">
              Create Wedding Page
            </button>
            <button className="rounded-xl border border-cream/65 bg-transparent px-8 py-4 text-base font-semibold text-cream">
              ▶ View Demo
            </button>
          </div>
        </div>
      </div>
      <svg
        className="pointer-events-none absolute top-42 right-[-60px] hidden h-[360px] w-[260px] text-cream/85 lg:block"
        viewBox="0 0 220 320"
        fill="none"
        aria-hidden
      >
        <path
          d="M15 190c40-10 36-63 12-91m12 91c27 0 57 13 78 46m-78-46c-11 17-28 31-39 40m90 6c17-12 36-32 45-62m-45 62c-4 18-2 39 8 66m37-128c23-11 43-34 56-68m-56 68c16 5 29 16 43 34m-63-127c17-11 23-28 24-49m-24 49c-11 3-18 11-22 26M26 98C13 84 8 64 11 40m15 58c19-4 37 4 53 20m-53-20c-2 16-9 29-20 38"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </section>
  );
}
