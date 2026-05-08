import { formatDate } from "@/lib/utils/date";

type WeddingInvitationCardProps = {
  coupleNames: string;
  weddingDate: string;
  venue: string;
  message?: string | null;
  eyebrow?: string;
  description?: string;
};

export function WeddingInvitationCard({
  coupleNames,
  weddingDate,
  venue,
  message,
  eyebrow = "Wedly Invitation",
  description = "A refined preview of the wedding page your guests will receive.",
}: WeddingInvitationCardProps) {
  return (
    <div className="wedly-invitation-card wedly-card rounded-[2.4rem] px-6 py-7 sm:px-8 sm:py-9">
      <div className="wedly-invitation-corner wedly-invitation-corner-top-left" />
      <div className="wedly-invitation-corner wedly-invitation-corner-top-right" />
      <div className="wedly-invitation-corner wedly-invitation-corner-bottom-left" />
      <div className="wedly-invitation-corner wedly-invitation-corner-bottom-right" />
      <div className="wedly-flower-outline left-8 top-10 h-18 w-18 wedly-float-soft opacity-40" />
      <div className="wedly-flower-outline bottom-12 right-8 h-24 w-24 wedly-float-slower opacity-35" />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="wedly-kicker">{eyebrow}</p>
            <p className="mt-2 text-sm leading-7 text-textMuted">{description}</p>
          </div>
          <div className="rounded-full border border-border/80 bg-white/70 px-4 py-2 text-sm font-medium text-primaryDark shadow-[0_10px_22px_rgba(110,83,69,0.08)]">
            Wedly
          </div>
        </div>

        <div className="mt-10 rounded-[2rem] border border-primary/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(249,240,233,0.92))] px-6 py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:px-8">
          <p className="text-center text-xs font-semibold tracking-[0.34em] uppercase text-primary/80">
            Together With Their Families
          </p>
          <h1 className="mt-8 break-words text-center text-4xl leading-[1] text-textMain sm:text-5xl xl:text-[3.8rem]">
            {coupleNames}
          </h1>
          <p className="mx-auto mt-5 max-w-md text-center text-sm leading-7 text-textMuted sm:text-base">
            Request the pleasure of your company as they celebrate their wedding day
            surrounded by the people they love most.
          </p>

          <div className="mx-auto mt-8 max-w-md border-y border-border/70 px-4 py-5 text-center">
            <p className="text-sm font-medium tracking-[0.24em] uppercase text-primary/85">
              {formatDate(weddingDate)}
            </p>
            <p className="mt-3 break-words text-lg leading-8 text-textMain sm:text-[1.18rem]">
              {venue}
            </p>
          </div>

          {message ? (
            <p className="mx-auto mt-7 max-w-lg break-words text-center text-sm leading-8 text-textMuted sm:text-base">
              {message}
            </p>
          ) : null}

          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-primary/35" />
            <span className="text-sm tracking-[0.3em] uppercase text-primary/75">RSVP</span>
            <span className="h-px w-12 bg-primary/35" />
          </div>
        </div>
      </div>
    </div>
  );
}
