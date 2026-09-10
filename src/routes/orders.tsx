import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PortalLayout } from "@/components/agri/portal-layout";
import { Metric, PageHeader, Panel, Pill } from "@/components/agri/ui-bits";
import { inr, kg, ORDER_TIMELINE, ORDERS, roadKm, BUYERS } from "@/lib/agri";
import { useFarmLocation } from "@/lib/location-context";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Order Tracking — AgriSense" },
      { name: "description", content: "Track every consignment from accepted offer to released payment." },
      { property: "og:title", content: "Order Tracking — AgriSense" },
      { property: "og:description", content: "Follow pickup, transit, delivery and settlement in one timeline." },
    ],
  }),
  component: Orders,
});

function Orders() {
  const { location } = useFarmLocation();
  const km = roadKm(location, BUYERS[0]!);

  return (
    <PortalLayout>
      <PageHeader
        eyebrow="Orders"
        title="Order tracking"
        description="Live status for every accepted offer, with distance and delivery windows from your farm."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Open orders" value={2} hint="1 in transit" />
        <Metric label="Value in flight" value={inr(334000)} hint="Across open orders" />
        <Metric label="Completed" value={1} hint="Last 30 days" />
      </div>

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">ORD-8841</p>
            <h2 className="mt-2 font-serif text-2xl">
              5,000 kg Tomato → Buyer A — Sahyadri Foods
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {km} km from {location.name} · {inr(150000)} order value
            </p>
          </div>
          <Pill tone="green">In transit</Pill>
        </div>

        <ol className="mt-8 space-y-0">
          {ORDER_TIMELINE.map((step, i) => (
            <li key={step.label} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full border text-xs",
                    step.done
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground",
                  )}
                >
                  {step.done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                {i < ORDER_TIMELINE.length - 1 ? (
                  <span className={cn("w-px flex-1", step.done ? "bg-primary" : "bg-border")} />
                ) : null}
              </div>
              <div className="pb-6">
                <p className={cn("text-sm font-medium", !step.done && "text-muted-foreground")}>
                  {step.label} {step.now ? <Pill tone="green">Now</Pill> : null}
                </p>
                <p className="text-xs text-muted-foreground">{step.time}</p>
              </div>
            </li>
          ))}
        </ol>

        <Link
          to="/logistics"
          className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground"
        >
          Track consignment
        </Link>
      </Panel>

      <Panel className="p-0">
        <h2 className="border-b border-border p-6 font-serif text-2xl">All orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                {["Order", "Crop", "Quantity", "Buyer", "Value", "Status", "Date"].map((h) => (
                  <th key={h} className="px-6 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ORDERS.map((o) => (
                <tr key={o.id} className="border-b border-border/60">
                  <td className="px-6 py-4 font-medium">{o.id}</td>
                  <td className="px-6 py-4">{o.crop}</td>
                  <td className="px-6 py-4">{kg(o.qty)}</td>
                  <td className="px-6 py-4">{o.buyer}</td>
                  <td className="px-6 py-4">{inr(o.value)}</td>
                  <td className="px-6 py-4">
                    <Pill tone={o.status === "Completed" ? "green" : o.status === "In transit" ? "solid" : "amber"}>
                      {o.status}
                    </Pill>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </PortalLayout>
  );
}
