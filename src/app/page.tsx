import { AuthCard } from "@/components/auth-card";
import { CreateWeddingForm } from "@/components/create-wedding-form";
import { FloatingPetals } from "@/components/floating-petals";
import { ManageWeddingCard } from "@/components/manage-wedding-card";
import { WeddingShell } from "@/components/wedding-shell";
import { getCurrentOwnerEmail } from "@/lib/owner-session";
import { getOwnerEvent } from "@/lib/actions/events";
import { getRsvpsByEvent } from "@/lib/actions/rsvps";
import { headers } from "next/headers";

function getBaseUrl(host: string) {
  if (!host) {
    return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  }

  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

const featureCards = [
  {
    number: "01",
    title: "Create Your RSVP Page",
    description: "Set up a refined wedding RSVP page in minutes.",
  },
  {
    number: "02",
    title: "Share With Guests",
    description: "Send one elegant link to collect confirmations and wishes.",
  },
  {
    number: "03",
    title: "Manage Responses",
    description: "Track RSVPs, review guest messages, and export your list anytime.",
  },
];

export default async function Home() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "";
  const baseUrl = getBaseUrl(host);
  const ownerEmail = await getCurrentOwnerEmail();
  const event = ownerEmail ? await getOwnerEvent(ownerEmail) : null;
  const rsvps = event ? await getRsvpsByEvent(event.id) : [];

  if (ownerEmail && event) {
    return (
      <main className="relative min-h-screen overflow-x-clip bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.92),transparent_32%),radial-gradient(circle_at_top_right,rgba(244,225,214,0.64),transparent_36%),linear-gradient(180deg,rgba(255,250,246,0.96),rgba(248,243,238,0.88)_44%,rgba(247,239,232,0.98)_100%)]" />
        <FloatingPetals />
        <div className="wedly-page-frame relative flex min-h-screen flex-col pb-14 pt-7 md:pb-18 md:pt-9">
          <div className="wedly-pill inline-flex items-center gap-3 self-start border border-border/70 bg-white/70 px-4 py-2 shadow-[0_10px_24px_rgba(110,83,69,0.08)] backdrop-blur">
            <span className="font-serif text-xl tracking-[0.08em] text-primaryDark">Wedly</span>
          </div>
          <div className="mt-6">
            <ManageWeddingCard
              event={event}
              publicLink={`${baseUrl}/w/${event.slug}`}
              rsvps={rsvps}
            />
          </div>
        </div>
      </main>
    );
  }

  if (ownerEmail && !event) {
    return (
      <main className="relative min-h-screen overflow-x-hidden bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(235,213,201,0.38),transparent_35%),linear-gradient(180deg,rgba(255,250,246,0.85),rgba(248,243,238,0))]" />
        <div className="wedly-page-frame relative flex min-h-screen flex-col pb-12 pt-7 md:pb-16 md:pt-9">
          <div className="wedly-pill inline-flex items-center gap-3 self-start border border-border/70 bg-white/70 px-4 py-2 shadow-[0_10px_24px_rgba(110,83,69,0.08)] backdrop-blur">
            <span className="font-serif text-xl tracking-[0.08em] text-primaryDark">Wedly</span>
          </div>
          <div className="mt-6">
            <WeddingShell
              eyebrow="Wedding Event Setup"
              title="Create Your Wedding Event"
              description="Fill in your wedding details to generate your RSVP page."
              panelLabel="A Refined Beginning"
              panelDescription="Set the tone for your wedding page with elegant details your guests will recognise instantly."
              priority="content"
              equalHeightDesktop
              stickyPanel={false}
            >
              <CreateWeddingForm />
            </WeddingShell>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative overflow-x-hidden bg-background">
      <div className="relative">
        <section className="wedly-hero-with-bg relative flex min-h-[92vh] items-center overflow-hidden pb-14 pt-8 md:pb-18 md:pt-10">
          <div className="wedly-page-frame relative z-10 w-full">
            <div className="max-w-2xl">
              <div className="wedly-pill inline-flex items-center gap-3 border border-border/70 bg-white/70 px-4 py-2 shadow-[0_10px_24px_rgba(110,83,69,0.08)] backdrop-blur">
                <span className="font-serif text-xl tracking-[0.08em] text-primaryDark">
                  Wedly
                </span>
              </div>
              <p className="wedly-kicker mt-10">Luxury Wedding RSVP</p>
              <h1 className="mt-5 max-w-2xl text-5xl leading-[0.96] text-textMain sm:text-6xl md:text-7xl lg:text-[5.5rem]">
                Create a Beautiful Wedding RSVP Experience
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-textMuted md:text-xl">
                Design a polished RSVP page, share it with your guests, and manage
                responses with ease.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a href="#wedly-entry" className="wedly-btn-primary wedly-btn-inline">
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="wedly-page-frame relative max-w-6xl pb-10 md:pb-14">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featureCards.map((card) => (
              <article
                key={card.number}
                className="wedly-ticket wedly-ticket-soft wedly-ornament flex min-h-[19rem] flex-col px-8 pb-8 pt-9"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/55 text-xl font-semibold text-primaryDark">
                  {card.number}
                </div>
                <div className="mt-7 flex items-center gap-3 text-sm font-medium tracking-[0.16em] uppercase text-primary/80">
                  <span>{card.number}</span>
                  <span className="h-px w-10 bg-primary/35" />
                </div>
                <h2 className="mt-5 max-w-[12rem] text-4xl leading-[1.03] text-textMain">
                  {card.title}
                </h2>
                <p className="mt-5 max-w-xs text-base leading-8 text-textMuted">
                  {card.description}
                </p>
                <div className="mt-auto pt-10" />
              </article>
            ))}
          </div>
        </section>

        <WeddingShell
          id="wedly-entry"
          eyebrow="Email Workspace"
          title="Start Your Wedly Page"
          description="Enter your email to continue. No email will be sent."
          equalHeightDesktop
        >
          <AuthCard />
        </WeddingShell>

        <div className="wedly-page-frame mx-auto flex max-w-6xl justify-center pb-16 pt-2">
          <p className="text-center text-sm text-textMuted">
            Designed for elegant wedding RSVPs.
          </p>
        </div>
      </div>
    </main>
  );
}
