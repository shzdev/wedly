import { ReactNode } from "react";

type WeddingShellProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function WeddingShell({
  eyebrow,
  title,
  description,
  children,
}: WeddingShellProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 md:px-8 md:py-16">
      <div className="overflow-hidden rounded-[2rem] border border-border bg-surface/90 shadow-[0_30px_60px_rgba(63,48,42,0.09)] backdrop-blur">
        <div className="grid gap-10 px-6 py-10 md:grid-cols-[1.1fr_1fr] md:px-12 md:py-14">
          <div>
            {eyebrow ? (
              <p className="text-xs font-semibold tracking-[0.35em] uppercase text-primary">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="mt-3 text-4xl leading-tight text-textMain md:text-6xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-5 max-w-xl text-base leading-relaxed text-textMuted md:text-lg">
                {description}
              </p>
            ) : null}
          </div>
          <div>{children}</div>
        </div>
      </div>
    </section>
  );
}
