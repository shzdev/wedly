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

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(185,143,120,0.2),transparent_43%),radial-gradient(circle_at_bottom_right,rgba(139,96,76,0.15),transparent_48%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-surface/50 to-transparent" />
      <div className="relative">
        <WeddingShell
          eyebrow="Luxury Wedding RSVP"
          title="Wedly"
          description="Create a beautiful wedding RSVP page in minutes."
        >
          {!user ? <AuthCard /> : null}
          {user && !event ? <CreateWeddingForm /> : null}
          {user && event ? (
            <ManageWeddingCard
              event={event}
              publicLink={`${baseUrl}/w/${event.slug}`}
              rsvps={rsvps}
            />
          ) : null}
        </WeddingShell>
        <div className="mx-auto mb-8 w-full max-w-6xl px-4 md:px-8">
          <p className="text-center text-sm text-textMuted">
            {user
              ? "Your wedding page is live. Share the link and collect RSVPs beautifully."
              : "Sign in to create your wedding RSVP page and share it instantly."}
          </p>
        </div>
        <footer className="mx-auto mb-8 w-full max-w-6xl px-4 md:px-8">
          <p className="text-center text-xs text-textMuted">
            Built with Next.js, Supabase, Sentry, and Vercel.
          </p>
        </footer>
      </div>
    </main>
  );
}
