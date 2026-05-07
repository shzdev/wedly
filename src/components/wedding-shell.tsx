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
    <section className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-14">
      <div className="overflow-hidden rounded-[2rem] border border-border bg-surface/95 shadow-[0_30px_60px_rgba(63,48,42,0.1)] backdrop-blur">
        <div className="grid gap-10 px-6 py-9 md:grid-cols-[1.08fr_1fr] md:px-12 md:py-13">
          <div className="self-center">
            {eyebrow ? (
              <p className="text-xs font-semibold tracking-[0.35em] uppercase text-primary">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="mt-3 text-5xl leading-[1.02] text-textMain md:text-7xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-5 max-w-xl text-base leading-relaxed text-textMuted md:text-xl">
                {description}
              </p>
            ) : null}
            <div className="mt-8 hidden h-px w-44 bg-gradient-to-r from-accent to-transparent md:block" />
          </div>
          <div>{children}</div>
        </div>
      </div>
    </section>
  );
}
