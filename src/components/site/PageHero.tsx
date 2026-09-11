import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("bg-hero-gradient border-b border-border", className)}>
      <div className="shell py-14 lg:py-20">
        <div className="max-w-3xl">
          {eyebrow ? (
            <span className="inline-flex items-center rounded-full border border-border bg-background/80 px-3.5 py-1.5 text-xs font-semibold tracking-[0.14em] text-primary uppercase">
              {eyebrow}
            </span>
          ) : null}
          <h1 className="mt-5 text-4xl font-semibold text-foreground sm:text-5xl">{title}</h1>
          {description ? (
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
