import { AuthCard } from "@/components/auth-card";
import { CreateWeddingForm } from "@/components/create-wedding-form";
import { ManageWeddingCard } from "@/components/manage-wedding-card";
import { WeddingShell } from "@/components/wedding-shell";
import { getCurrentUser, getUserEvent } from "@/lib/actions/events";
import { getRsvpsByEvent } from "@/lib/actions/rsvps";
import { headers } from "next/headers";

function getBaseUrl(host: string) {
  if (!host) {
    return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  }

  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

export default async function Home() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "";
  const baseUrl = getBaseUrl(host);
  const user = await getCurrentUser();
  const event = user ? await getUserEvent() : null;
  const rsvps = event ? await getRsvpsByEvent(event.id) : [];
  const latestWishes = rsvps.slice(0, 5);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(185,143,120,0.16),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(139,96,76,0.14),transparent_45%)]" />
      <div className="relative">
        <WeddingShell
          eyebrow="Luxury RSVP + Guestbook"
          title="Wedly"
          description="A simple and beautiful wedding RSVP page you can launch in minutes."
        >
          {!user ? <AuthCard /> : null}
          {user && !event ? <CreateWeddingForm /> : null}
          {user && event ? (
            <ManageWeddingCard
              event={event}
              publicLink={`${baseUrl}/w/${event.slug}`}
              rsvpCount={rsvps.length}
              latestWishes={latestWishes}
            />
          ) : null}
        </WeddingShell>
        <div className="mx-auto mb-10 w-full max-w-6xl px-4 md:px-8">
          <p className="text-center text-sm text-textMuted">
            {user
              ? "Your single-event workspace is active."
              : "Sign in first. Then create one public wedding page for v1."}
          </p>
        </div>
      </div>
    </main>
  );
}
