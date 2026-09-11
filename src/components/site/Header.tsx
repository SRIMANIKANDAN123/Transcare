import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { SearchDialog } from "@/components/site/SearchDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";

const nav = [
  { label: "Home", to: "/" },
  { label: "Explore", to: "/explore" },
  { label: "Services", to: "/services" },
  { label: "Support", to: "/support" },
  { label: "About", to: "/about" },
] as const;

const secondaryNav = [
  { label: "Nearby care", to: "/nearby" },
  { label: "Affordable care", to: "/affordable-care" },
  { label: "Government benefits", to: "/schemes" },
  { label: "Learn", to: "/learn" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="TransCare home">
      <span className="bg-brand-gradient grid size-9 place-items-center rounded-xl shadow-card">
        <ShieldCheck className="size-5 text-primary-foreground" aria-hidden="true" />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-lg font-semibold tracking-tight text-foreground">
          TransCare
        </span>
        <span className="block text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          Inclusive healthcare
        </span>
      </span>
    </Link>
  );
}

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-lg">
        <div className="shell grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 lg:h-[4.5rem]">
          <div className="flex min-w-0 items-center gap-8">
            <Logo />
            <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  activeProps={{ className: "bg-secondary text-foreground" }}
                  className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              className="rounded-full"
            >
              <Search className="size-5" aria-hidden="true" />
            </Button>

            <Button asChild className="hidden rounded-full px-5 sm:inline-flex">
              <Link to="/explore">Find Care</Link>
            </Button>

            <div className="hidden lg:block">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      aria-label="Account menu"
                    >
                      <UserRound className="size-5" aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="truncate">{user?.fullName}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Your profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/register">Healthcare preferences</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/schemes">Benefits</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={async () => {
                        await signOut();
                        toast.success("You are logged out");
                        navigate({ to: "/login", replace: true });
                      }}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild variant="outline" className="rounded-full px-5">
                  <Link to="/login">Log in</Link>
                </Button>
              )}
            </div>

            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full lg:hidden" aria-label="Open menu">
                  <Menu className="size-5" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[86vw] max-w-sm overflow-y-auto">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="mt-2 mb-6">
                  <Logo />
                </div>
                <nav aria-label="Mobile" className="space-y-1">
                  {[...nav, ...secondaryNav].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                      activeOptions={{ exact: item.to === "/" }}
                      activeProps={{ className: "bg-secondary text-foreground" }}
                      className="block rounded-xl px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-6 space-y-2">
                  <Button asChild className="w-full">
                    <Link to="/explore" onClick={() => setMenuOpen(false)}>
                      Find Care
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setMenuOpen(false);
                      setSearchOpen(true);
                    }}
                  >
                    Search TransCare
                  </Button>
                  {isAuthenticated ? (
                    <>
                      <Button asChild variant="ghost" className="w-full">
                        <Link to="/profile" onClick={() => setMenuOpen(false)}>
                          Your profile
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={async () => {
                          setMenuOpen(false);
                          await signOut();
                          navigate({ to: "/login", replace: true });
                        }}
                      >
                        Log out
                      </Button>
                    </>
                  ) : (
                    <Button asChild variant="ghost" className="w-full">
                      <Link to="/login" onClick={() => setMenuOpen(false)}>
                        Log in
                      </Link>
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
