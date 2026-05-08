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
      <main className="relative min-h-screen overflow-hidden bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.92),transparent_32%),radial-gradient(circle_at_top_right,rgba(244,225,214,0.64),transparent_36%),linear-gradient(180deg,rgba(255,250,246,0.96),rgba(248,243,238,0.88)_44%,rgba(247,239,232,0.98)_100%)]" />
        <FloatingPetals />
        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-16 pt-8 md:px-8 md:pb-20 md:pt-10">
          <div className="inline-flex items-center gap-3 self-start rounded-full border border-border/70 bg-white/70 px-4 py-2 shadow-[0_10px_24px_rgba(110,83,69,0.08)] backdrop-blur">
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
      <main className="relative min-h-screen overflow-hidden bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(235,213,201,0.38),transparent_35%),linear-gradient(180deg,rgba(255,250,246,0.85),rgba(248,243,238,0))]" />
        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-14 pt-8 md:px-8 md:pb-18 md:pt-10">
          <div className="inline-flex items-center gap-3 self-start rounded-full border border-border/70 bg-white/70 px-4 py-2 shadow-[0_10px_24px_rgba(110,83,69,0.08)] backdrop-blur">
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
            >
              <CreateWeddingForm />
            </WeddingShell>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative overflow-hidden bg-background">
      <div className="absolute inset-x-0 top-0 h-[48rem] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.85),transparent_35%),radial-gradient(circle_at_top_right,rgba(235,213,201,0.52),transparent_42%),linear-gradient(180deg,rgba(255,250,246,0.92),rgba(248,243,238,0))]" />
      <div className="relative">
        <section className="mx-auto grid min-h-[92vh] w-full max-w-7xl items-center gap-12 px-4 pb-16 pt-10 md:px-8 md:pb-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-border/70 bg-white/70 px-4 py-2 shadow-[0_10px_24px_rgba(110,83,69,0.08)] backdrop-blur">
              <span className="font-serif text-xl tracking-[0.08em] text-primaryDark">Wedly</span>
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
                <span aria-hidden="true" className="text-lg leading-none">
                  v
                </span>
              </a>
            </div>
          </div>
          <div className="relative min-h-[26rem] md:min-h-[36rem]">
            <div className="absolute -left-3 top-10 h-14 w-14 rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffd3c4,#dfab93)] opacity-80 blur-[1px]" />
            <div className="absolute bottom-16 left-4 h-12 w-12 rounded-full bg-[radial-gradient(circle_at_35%_30%,#f6ccb7,#dca78d)] opacity-65 blur-[1px]" />
            <div className="absolute right-0 top-0 hidden h-48 w-40 rounded-[999px] border border-primary/25 lg:block" />
            <div className="absolute inset-0 rounded-[2.7rem] bg-[radial-gradient(circle_at_18%_24%,rgba(255,255,255,0.98),rgba(255,248,242,0.74)_34%,transparent_55%),linear-gradient(135deg,rgba(255,248,241,0.94),rgba(245,224,209,0.5)_42%,rgba(201,150,123,0.18)_100%)] shadow-[0_36px_90px_rgba(110,83,69,0.18)]" />
            <div className="absolute inset-x-[10%] bottom-0 top-[10%] rounded-[2.3rem] bg-[linear-gradient(180deg,rgba(255,247,240,0.86),rgba(236,209,190,0.44)),radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.55),transparent_30%)]" />
            <div className="absolute bottom-[7%] left-[16%] h-[18%] w-[68%] rounded-[999px] bg-[radial-gradient(circle_at_center,rgba(181,133,104,0.22),transparent_70%)] blur-xl" />
            <div className="absolute bottom-[14%] left-[28%] h-[68%] w-[20%] rounded-t-[8rem] rounded-b-[2rem] bg-[linear-gradient(180deg,#4f382d,#241a16)] shadow-[0_20px_40px_rgba(44,25,18,0.22)]" />
            <div className="absolute bottom-[14%] left-[47%] h-[52%] w-[15%] rounded-t-[6rem] rounded-b-[2rem] bg-[linear-gradient(180deg,#745347,#2f241f)] shadow-[0_18px_38px_rgba(44,25,18,0.18)]" />
            <div className="absolute bottom-[14%] left-[52%] h-[45%] w-[24%] rounded-t-[9rem] rounded-b-[2.8rem] bg-[linear-gradient(180deg,rgba(248,237,231,0.96),rgba(232,201,185,0.88))] shadow-[0_22px_36px_rgba(172,132,108,0.22)]" />
            <div className="absolute inset-x-[9%] bottom-[8%] h-[16%] rounded-[999px] bg-[linear-gradient(180deg,rgba(194,152,129,0.18),rgba(255,255,255,0))]" />
            <div className="absolute left-[6%] top-[12%] h-32 w-32 rounded-full border border-primary/20" />
            <div className="absolute bottom-[10%] right-[6%] h-40 w-40 rounded-full border border-primary/18" />
          </div>
        </section>

        <section className="relative mx-auto w-full max-w-6xl px-4 pb-10 md:px-8 md:pb-14">
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
        >
          <AuthCard />
        </WeddingShell>

        <div className="mx-auto flex w-full max-w-6xl justify-center px-4 pb-16 pt-2 md:px-8">
          <p className="text-center text-sm text-textMuted">
            Designed for elegant wedding RSVPs.
          </p>
        </div>
      </div>
    </main>
  );
}
