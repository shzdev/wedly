import { ReactNode } from "react";

type WeddingShellProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  panelLabel?: string;
  panelDescription?: string;
  priority?: "panel" | "content";
  children: ReactNode;
};

export function WeddingShell({
  id,
  eyebrow,
  title,
  description,
  panelLabel = "Wedly Invitation Studio",
  panelDescription = "A calm, polished RSVP experience for couples who want one refined link.",
  priority = "panel",
  children,
}: WeddingShellProps) {
  return (
    <section
      id={id}
      className="wedly-section-shell relative mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-10"
    >
      <div className="wedly-ticket wedly-ticket-large grid overflow-hidden md:grid-cols-[0.92fr_1.08fr]">
        <div
          className={[
            "relative flex min-h-[18rem] items-center justify-center border-b border-border/70 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96),rgba(250,241,233,0.86)_52%,rgba(243,229,221,0.78)_100%)] px-8 py-10 md:min-h-[34rem] md:border-r md:border-b-0 md:px-10",
            priority === "content" ? "order-2 md:order-1" : "",
          ].join(" ")}
        >
          <div className="wedly-flower-outline left-[14%] top-[20%] h-20 w-20" />
          <div className="wedly-flower-outline right-[18%] bottom-[18%] h-28 w-28 opacity-40" />
          <div className="relative text-center md:text-left">
            <div className="mx-auto flex max-w-[15rem] items-center justify-center md:justify-start">
              <div className="relative h-36 w-36">
                <div className="wedly-flower-outline inset-0 h-full w-full" />
                <div className="wedly-flower-outline left-5 top-5 h-26 w-26 opacity-45" />
              </div>
            </div>
            <p className="mt-5 text-sm font-medium tracking-[0.18em] uppercase text-primary/80">
              {panelLabel}
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-textMuted">
              {panelDescription}
            </p>
          </div>
        </div>
        <div
          className={[
            "relative bg-surface px-6 py-7 md:px-10 md:py-10",
            priority === "content" ? "order-1 md:order-2" : "",
          ].join(" ")}
        >
          <div className="wedly-ticket-divider absolute inset-y-6 left-0 hidden w-8 md:block" />
          <div className="relative z-10 md:pl-4">
            {eyebrow ? <p className="wedly-kicker">{eyebrow}</p> : null}
            <h2 className="mt-3 text-4xl leading-tight text-textMain md:text-5xl">{title}</h2>
            {description ? (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-textMuted md:text-base">
                {description}
              </p>
            ) : null}
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
