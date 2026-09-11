import { Link } from "@tanstack/react-router";

import { Logo } from "@/components/site/Header";

const columns = [
  {
    title: "Healthcare services",
    links: [
      { label: "All services", to: "/services" as const },
      { label: "Hormone care", to: "/services" as const },
      { label: "Mental healthcare", to: "/services" as const },
      { label: "Voice & speech", to: "/services" as const },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Explore providers", to: "/explore" as const },
      { label: "Nearby care", to: "/nearby" as const },
      { label: "Affordable care", to: "/affordable-care" as const },
      { label: "Learn", to: "/learn" as const },
    ],
  },
  {
    title: "Government benefits",
    links: [
      { label: "All schemes", to: "/schemes" as const },
      { label: "Health insurance", to: "/schemes" as const },
      { label: "Financial assistance", to: "/affordable-care" as const },
    ],
  },
  {
    title: "Support & more",
    links: [
      { label: "Support", to: "/support" as const },
      { label: "About", to: "/about" as const },
      { label: "Contact", to: "/contact" as const },
      { label: "Privacy", to: "/privacy" as const },
      { label: "Terms", to: "/terms" as const },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-8 border-t border-border bg-surface">
      <div className="shell py-14">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_repeat(4,minmax(0,1fr))]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Healthcare information platform for easier discovery and access.
            </p>
            <p className="mt-4 text-sm font-medium text-foreground">
              Discover → Understand → Afford → Access
            </p>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 space-y-3 border-t border-border pt-6 text-sm text-muted-foreground">
          <p>
            Always confirm current healthcare services, costs and eligibility directly with the
            provider or official source.
          </p>
          <p>© 2026 TransCare</p>
        </div>
      </div>
    </footer>
  );
}
