import { createFileRoute } from "@tanstack/react-router";
import { Clock3 } from "lucide-react";
import { useState } from "react";

import { Disclaimer } from "@/components/site/DemoBadge";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { articles } from "@/data/articles";
import type { Article } from "@/data/types";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Healthcare Information — TransCare" },
      {
        name: "description",
        content:
          "General educational information about gender-affirming healthcare, hormone-related care, consultations, costs and government benefits.",
      },
      { property: "og:title", content: "Healthcare Information — TransCare" },
      {
        property: "og:description",
        content: "General educational reading on healthcare, costs and benefits.",
      },
    ],
  }),
  component: LearnPage,
});

function LearnPage() {
  const [open, setOpen] = useState<Article | null>(null);
  const categories = Array.from(new Set(articles.map((a) => a.category)));
  const [filter, setFilter] = useState("All");
  const visible = filter === "All" ? articles : articles.filter((a) => a.category === filter);

  return (
    <>
      <PageHero
        eyebrow="Learn"
        title="Healthcare Information"
        description="Plain-language reading to help you prepare for appointments and understand costs and benefits. General information only — never a diagnosis or a prescription."
      >
        <div className="flex flex-wrap gap-2">
          {["All", ...categories].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              aria-pressed={filter === category}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                filter === category
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background/80 hover:border-primary hover:text-primary"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </PageHero>

      <div className="shell py-12 lg:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((article) => (
            <article key={article.id} className="card-surface card-hover flex flex-col p-7">
              <span className="text-xs font-semibold tracking-[0.12em] text-primary uppercase">
                {article.category}
              </span>
              <h2 className="mt-3 text-lg font-semibold">{article.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {article.summary}
              </p>
              <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock3 className="size-4" aria-hidden="true" />
                {article.readTime}
              </p>
              <Button className="mt-5 rounded-full" onClick={() => setOpen(article)}>
                Read more
              </Button>
            </article>
          ))}
        </div>

        <Disclaimer className="mt-12">
          TransCare shares general educational information and never diagnoses conditions, prescribes
          medicines or recommends treatment for an individual. Speak with a qualified healthcare
          professional about your own care.
        </Disclaimer>
      </div>

      <Dialog open={!!open} onOpenChange={(value) => !value && setOpen(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{open?.title}</DialogTitle>
            <DialogDescription>
              {open?.category} · {open?.readTime}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {open?.body.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
