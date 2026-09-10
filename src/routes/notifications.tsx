import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowUpRight, Bell, CheckCheck } from "lucide-react";
import { PortalLayout } from "@/components/agri/portal-layout";
import { PageHeader, Panel, Pill } from "@/components/agri/ui-bits";
import { useNotifications } from "@/lib/notification-context";
import type { NotificationCategory } from "@/services";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — AgriSense" },
      {
        name: "description",
        content:
          "Price alerts, buyer bids, logistics events and settlement updates for your crop lots in one feed.",
      },
      { property: "og:title", content: "Notifications — AgriSense" },
      {
        property: "og:description",
        content: "Every alert that changes what your harvest earns.",
      },
    ],
  }),
  component: NotificationsPage,
});

const TABS: { key: "all" | NotificationCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "price", label: "Price alerts" },
  { key: "bids", label: "Buyer bids" },
  { key: "logistics", label: "Logistics" },
  { key: "settlements", label: "Settlements" },
];

function NotificationsPage() {
  const { items, unread, markAllRead, markRead } = useNotifications();
  const [tab, setTab] = useState<"all" | NotificationCategory>("all");
  const list = tab === "all" ? items : items.filter((n) => n.category === tab);

  return (
    <PortalLayout>
      <PageHeader
        eyebrow="Alerts"
        title="Notifications"
        description="Everything that moved your price, your buyer or your money."
        action={
          <button
            onClick={() => {
              markAllRead();
              toast.success("All notifications marked as read");
            }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm"
          >
            <CheckCheck className="h-4 w-4" /> Mark all as read
          </button>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        {TABS.map((t) => {
          const count =
            t.key === "all"
              ? items.filter((n) => !n.read).length
              : items.filter((n) => n.category === t.key && !n.read).length;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
                tab === t.key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              {t.label}
              {count > 0 ? (
                <span
                  className={cn(
                    "rounded-full px-2 text-xs",
                    tab === t.key ? "bg-primary-foreground/20" : "bg-clay/15 text-clay",
                  )}
                >
                  {count}
                </span>
              ) : null}
            </button>
          );
        })}
        <span className="ml-auto text-sm text-muted-foreground">{unread} unread</span>
      </div>

      <div className="space-y-3">
        {list.map((n) => (
          <Panel
            key={n.id}
            className={cn("flex flex-wrap items-start gap-4", !n.read && "border-primary/40")}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary">
              <Bell className="h-4 w-4 text-primary" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{n.title}</p>
                {!n.read ? <Pill tone="clay">New</Pill> : null}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
              <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
            </div>
            <div className="flex items-center gap-2">
              {!n.read ? (
                <button
                  onClick={() => markRead(n.id)}
                  className="rounded-full border border-border px-4 py-2 text-xs"
                >
                  Mark read
                </button>
              ) : null}
              <Link
                to={n.link.to}
                onClick={() => markRead(n.id)}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs text-primary-foreground"
              >
                {n.link.label} <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Panel>
        ))}
        {list.length === 0 ? (
          <Panel>
            <p className="text-sm text-muted-foreground">Nothing in this category yet.</p>
          </Panel>
        ) : null}
      </div>
    </PortalLayout>
  );
}
