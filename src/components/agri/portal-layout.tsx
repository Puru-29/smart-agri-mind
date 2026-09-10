import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Bell,
  Boxes,
  Brain,
  Building2,
  ChevronLeft,
  LayoutDashboard,
  LineChart,
  Menu,
  Package,
  Sprout,
  Store,
  Truck,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LocationSelector } from "./location-selector";
import { useFarmLocation } from "@/lib/location-context";
import { useNotifications } from "@/lib/notification-context";
import { useI18n } from "@/lib/i18n";
import { LanguageSelector } from "./language-selector";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/crops", label: "My Crops", icon: Sprout },
  { to: "/markets", label: "Markets", icon: Store },
  { to: "/decision", label: "AI Decision", icon: Brain },
  { to: "/forecast", label: "Price Forecast", icon: LineChart },
  { to: "/buyers", label: "Buyers", icon: Users },
  { to: "/orders", label: "Orders", icon: Package },
  { to: "/logistics", label: "Logistics", icon: Truck },
  { to: "/payments", label: "Settlements", icon: Wallet },
  { to: "/fpo", label: "FPO", icon: Building2 },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function PortalLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const { location } = useFarmLocation();
  const { unread } = useNotifications();
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-sidebar px-4 py-6 transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Boxes className="h-4 w-4" />
            </span>
            <span className="font-serif text-lg">AgriSense</span>
          </Link>
          <button
            className="lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {t(item.label)}
                {item.to === "/notifications" && unread > 0 ? (
                  <span
                    className={cn(
                      "ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold",
                      active ? "bg-primary-foreground/20" : "bg-clay/15 text-clay",
                    )}
                  >
                    {unread}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="absolute inset-x-4 bottom-6 space-y-3">
          <LanguageSelector className="w-full justify-between lg:hidden" />
          <div className="rounded-2xl border border-border bg-card p-4">
          <p className="eyebrow">{t("Farm location")}</p>
          <p className="mt-1 text-sm font-medium">
            {location.name}, {location.district}
          </p>
          <p className="text-xs text-muted-foreground">{location.belt}</p>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border bg-background/85 px-4 py-3 backdrop-blur md:px-8">
          <button
            className="lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="hidden text-sm text-muted-foreground md:block">
            Farmer portal · Ramesh Patil
          </p>
          <div className="ml-auto flex items-center gap-3">
            <LocationSelector />
            <Link
              to="/notifications"
              className="relative rounded-full border border-border bg-card p-2"
              aria-label={`Notifications, ${unread} unread`}
            >
              <Bell className="h-4 w-4" />
              {unread > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay px-1 text-[10px] font-semibold text-primary-foreground">
                  {unread}
                </span>
              ) : null}
            </Link>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              R
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
