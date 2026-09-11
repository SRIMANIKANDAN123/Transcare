import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Disclaimer } from "@/components/site/DemoBadge";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact the TransCare team" },
      {
        name: "description",
        content:
          "Send feedback, suggest a provider listing or report an information problem.",
      },
      { property: "og:title", content: "Contact the TransCare team" },
      {
        property: "og:description",
        content: "Feedback, listing suggestions and information corrections.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us what would make this more useful"
        description="Feedback, listing suggestions and corrections all help us keep TransCare useful."
      />

      <div className="shell grid gap-8 py-12 lg:grid-cols-[1.3fr_1fr] lg:py-16">
        <form
          className="card-surface space-y-5 p-7 lg:p-9"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
            toast.success("Message received", {
              description: "Thank you — we will review your message.",
            });
          }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Your name</Label>
              <Input id="name" name="name" required placeholder="Name" autoComplete="name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input id="topic" name="topic" placeholder="Feedback, listing suggestion, correction" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" required rows={6} placeholder="How can we help?" />
          </div>
          <Button type="submit" size="lg" className="rounded-full px-8">
            <MessageSquare className="size-4" aria-hidden="true" />
            Send message
          </Button>
          {sent ? (
            <p aria-live="polite" className="text-sm font-medium text-success">
              Thanks — your message has been noted.
            </p>
          ) : null}
        </form>

        <aside className="space-y-6">
          <section className="card-surface p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Mail className="size-5 text-primary" aria-hidden="true" />
              Project contact
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              TransCare is built by a student team for an innovation showcase. Contact details will be
              published with the final submission.
            </p>
          </section>

          <section className="card-surface p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <AlertTriangle className="size-5 text-rose" aria-hidden="true" />
              Urgent help
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              This form is not monitored. For medical emergencies call 108. For mental health support,
              the government Tele-MANAS helpline is 14416.
            </p>
          </section>

          <Disclaimer>
            Please do not share personal health information here.
          </Disclaimer>
        </aside>
      </div>
    </>
  );
}
