import { Link } from "@tanstack/react-router";
import { Building2, FileText, HeartPulse, Landmark, Search, Stethoscope, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { searchAll } from "@/lib/api";

const suggestions = [
  "Endocrinologist",
  "Mental Healthcare",
  "Hormone Care",
  "Gender-Affirming Care",
  "Voice Therapy",
];

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [term, setTerm] = useState("");
  const results = useMemo(() => searchAll(term), [term]);

  useEffect(() => {
    if (!open) setTerm("");
  }, [open]);

  const close = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border p-5 text-left">
          <DialogTitle className="text-base">Search TransCare</DialogTitle>
          <div className="relative mt-3">
            <Search
              className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              autoFocus
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search providers, doctors, services, schemes, organisations..."
              className="h-11 pl-9"
              aria-label="Search TransCare"
            />
          </div>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto p-5">
          {!term ? (
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                Suggested searches
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTerm(s)}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-sm transition-colors hover:border-primary hover:text-primary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : results.total === 0 ? (
            <div className="py-10 text-center">
              <p className="font-medium text-foreground">No matches for “{term}”</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try a service such as “Hormone Care”, or browse all providers on Explore.
              </p>
              <Link
                to="/explore"
                onClick={close}
                className="mt-4 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                Open Explore →
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <Group title="Providers" icon={Building2}>
                {results.providers.map((p) => (
                  <Row
                    key={p.id}
                    to="/provider/$providerId"
                    params={{ providerId: p.id }}
                    onClick={close}
                    title={p.name}
                    meta={`${p.type} · ${p.location}`}
                  />
                ))}
              </Group>
              <Group title="Doctors & specialists" icon={Stethoscope}>
                {results.doctors.map((d) => (
                  <Row
                    key={d.id}
                    to="/provider/$providerId"
                    params={{ providerId: d.providerId }}
                    onClick={close}
                    title={d.name}
                    meta={`${d.specialty} · ${d.city}`}
                  />
                ))}
              </Group>
              <Group title="Services" icon={HeartPulse}>
                {results.services.map((s) => (
                  <Row
                    key={s.id}
                    to="/explore"
                    search={{ service: s.searchKey }}
                    onClick={close}
                    title={s.title}
                    meta={s.group}
                  />
                ))}
              </Group>
              <Group title="Government benefits" icon={Landmark}>
                {results.schemes.map((s) => (
                  <Row
                    key={s.id}
                    to="/schemes/$schemeId"
                    params={{ schemeId: s.id }}
                    onClick={close}
                    title={s.name}
                    meta={s.authority}
                  />
                ))}
              </Group>
              <Group title="Organisations" icon={Users}>
                {results.organisations.map((o) => (
                  <Row
                    key={o.id}
                    to="/support"
                    onClick={close}
                    title={o.name}
                    meta={`${o.type} · ${o.city}`}
                  />
                ))}
              </Group>
              <Group title="Read about it" icon={FileText}>
                <Row to="/learn" onClick={close} title="Healthcare information articles" meta="Learn" />
              </Group>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Group({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  const items = Array.isArray(children) ? children.filter(Boolean) : children;
  if (Array.isArray(items) && items.length === 0) return null;
  return (
    <section>
      <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
        <Icon className="size-3.5" aria-hidden="true" />
        {title}
      </p>
      <ul className="mt-2 space-y-1">{items}</ul>
    </section>
  );
}

function Row(props: {
  to: string;
  params?: Record<string, string>;
  search?: Record<string, string>;
  onClick: () => void;
  title: string;
  meta: string;
}) {
  const { to, params, search, onClick, title, meta } = props;
  return (
    <li>
      <Link
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        to={to as any}
        params={params as never}
        search={search as never}
        onClick={onClick}
        className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted"
      >
        <span className="min-w-0">
          <span className="block truncate font-medium text-foreground">{title}</span>
          <span className="block truncate text-sm text-muted-foreground">{meta}</span>
        </span>
        <span className="shrink-0 text-sm text-primary">Open</span>
      </Link>
    </li>
  );
}
