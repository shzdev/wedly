export function Footer() {
  const links = ["Features", "How It Works", "Demo", "Pricing", "FAQ"];

  return (
    <footer className="relative mt-auto bg-terracotta text-cream">
      <div className="section-shell py-9">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-4xl leading-none font-serif">Wedly</h3>
            <p className="mt-2 text-sm text-cream/80">
              © 2026 Wedly. All rights reserved.
            </p>
          </div>
          <ul className="flex flex-wrap gap-6 text-sm font-medium">
            {links.map((link) => (
              <li key={link}>
                <a href="#" className="hover:text-white">
                  {link}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex gap-3">
            {["ig", "fb", "wa"].map((social) => (
              <button
                key={social}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/40 text-xs font-semibold uppercase"
              >
                {social}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
