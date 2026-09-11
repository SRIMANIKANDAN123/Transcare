import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";

const PUBLIC_PATHS = ["/login", "/signup", "/about", "/contact", "/privacy", "/terms"];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** Lightweight client-side guard: unauthenticated visitors land on /login. */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, ready } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const open = isPublic(pathname);

  useEffect(() => {
    if (ready && !isAuthenticated && !open) {
      navigate({ to: "/login", replace: true });
    }
  }, [ready, isAuthenticated, open, navigate, pathname]);

  if (!ready || (!isAuthenticated && !open)) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Loading TransCare…
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
