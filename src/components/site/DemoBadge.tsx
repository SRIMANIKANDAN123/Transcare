import { cn } from "@/lib/utils";

export function Disclaimer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "rounded-2xl border border-border bg-muted/60 p-4 text-sm leading-relaxed text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}
