import Image from "next/image";

export function PreviewSection() {
  return (
    <section className="bg-[#f6ece6] py-20">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.9fr_1.3fr] lg:items-end">
        <div>
          <p className="text-xs font-semibold tracking-[0.35em] uppercase text-terracotta">
            See It In Action
          </p>
          <h2 className="mt-4 max-w-[450px] text-6xl leading-tight text-deep">
            Beautiful Pages Your Guests Will Love
          </h2>
          <p className="mt-6 max-w-[430px] text-xl leading-relaxed text-muted">
            Your Wedly page is designed to look stunning on any device. Simple,
            elegant, and focused on what matters.
          </p>
          <button className="mt-8 rounded-xl bg-terracotta px-8 py-4 text-base font-semibold text-cream">
            View Live Demo
          </button>
        </div>
        <div className="relative h-[390px]">
          <div className="absolute right-22 bottom-0 h-[300px] w-[520px] rounded-[22px] border-8 border-[#2f2f2f] bg-black shadow-[0_24px_30px_rgba(0,0,0,0.25)]">
            <Image
              src="/wedly-reference.png"
              alt="Laptop mockup"
              fill
              className="rounded-[14px] object-cover object-[center_55%]"
            />
          </div>
          <div className="absolute right-0 bottom-0 h-[280px] w-[152px] rounded-[30px] border-[7px] border-[#141414] bg-black shadow-[0_22px_35px_rgba(0,0,0,0.28)]">
            <Image
              src="/wedly-reference.png"
              alt="Phone mockup"
              fill
              className="rounded-[20px] object-cover object-[center_58%]"
            />
          </div>
        </div>
      </div>
      <div className="mt-16 bg-[#b57f69] py-8 text-cream">
        <div className="section-shell flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-5xl">Ready to create your Wedly page?</h3>
            <p className="mt-2 text-base text-cream/85">
              Join hundreds of couples who trust Wedly for their special day.
            </p>
          </div>
          <button className="h-14 rounded-xl bg-cream px-8 text-base font-semibold text-terracotta">
            Create Wedding Page Now
          </button>
        </div>
      </div>
    </section>
  );
}
