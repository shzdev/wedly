const navLinks = ["Features", "How It Works", "Demo", "Pricing", "FAQ"];

export function Navbar() {
  return (
    <div className="section-shell relative z-20 pt-7">
      <nav className="mx-auto flex h-16 items-center rounded-[26px] bg-cream/95 px-6 shadow-[0_18px_45px_rgba(58,36,28,0.16)] backdrop-blur">
        <div className="w-32 text-[42px] leading-none font-serif text-terracotta">
          Wedly
        </div>
        <ul className="hidden flex-1 items-center justify-center gap-10 text-sm font-medium text-deep lg:flex">
          {navLinks.map((link) => (
            <li key={link}>
              <a href="#" className="transition-colors hover:text-terracotta">
                {link}
              </a>
            </li>
          ))}
        </ul>
        <div className="ml-auto flex items-center gap-5">
          <a href="#" className="hidden text-sm font-semibold text-deep md:block">
            Log in
          </a>
          <button className="rounded-xl bg-terracotta px-5 py-3 text-sm font-semibold text-cream shadow-[0_10px_24px_rgba(169,110,88,0.35)] transition hover:bg-rose">
            Create Wedding Page
          </button>
        </div>
      </nav>
    </div>
  );
}
