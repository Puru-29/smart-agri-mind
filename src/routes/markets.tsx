import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { PortalLayout } from "@/components/agri/portal-layout";
import { Metric, PageHeader, Panel, Pill } from "@/components/agri/ui-bits";
import { useFarmLocation } from "@/lib/location-context";
import { buildComparison, inr, MARKETS, roadKm, transportPerKg } from "@/lib/agri";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/markets")({
  head: () => ({
    meta: [
      { title: "Markets — AgriSense" },
      { name: "description", content: "Mandi prices, arrivals and freight-adjusted net realization near your farm." },
      { property: "og:title", content: "Markets — AgriSense" },
      { property: "og:description", content: "Compare mandis and buyers side by side from your farm gate." },
    ],
  }),
  component: Markets,
});

function Markets() {
  const { location } = useFarmLocation();
  const [tab, setTab] = useState<"all" | "buyers" | "mandis">("all");
  const rows = buildComparison(location).filter((r) =>
    tab === "all" ? true : tab === "buyers" ? r.sub.startsWith("Buyer") : r.sub.startsWith("Mandi"),
  );
  const best = MARKETS.reduce((a, b) => (b.price > a.price ? b : a));
  const nearest = MARKETS.reduce((a, b) =>
    roadKm(location, b) < roadKm(location, a) ? b : a,
  );
  const avg = Math.round((MARKETS.reduce((s, m) => s + m.price, 0) / MARKETS.length) * 10) / 10;

  return (
    <PortalLayout>
      <PageHeader
        eyebrow="Market intelligence"
        title="Markets near you"
        description={`Prices for Grade A tomato, adjusted for road distance from ${location.name}, ${location.district}.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Markets tracked" value={MARKETS.length} hint="Within 250 km" />
        <Metric label="Average price" value={`${inr(avg)}/kg`} hint="Across tracked mandis" />
        <Metric label="Highest price" value={`${inr(best.price)}/kg`} hint={best.name} />
        <Metric
          label="Nearest mandi"
          value={`${roadKm(location, nearest)} km`}
          hint={nearest.name}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {MARKETS.map((m) => {
          const km = roadKm(location, m);
          const freight = transportPerKg(km);
          return (
            <Panel key={m.id}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-serif text-xl">{m.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {km} km from {location.name}
                  </p>
                </div>
                <Pill tone={m.demand === "High" ? "green" : m.demand === "Medium" ? "muted" : "clay"}>
                  {m.demand}
                </Pill>
              </div>
              <p className="mt-4 font-serif text-3xl">{inr(m.price)}/kg</p>
              <p
                className={cn(
                  "mt-1 flex items-center gap-1 text-xs",
                  m.trend >= 0 ? "text-primary" : "text-clay",
                )}
              >
                {m.trend >= 0 ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                {m.trend}% week on week
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Arrivals</p>
                  <p>{m.arrivals}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Freight</p>
                  <p>{inr(freight)}/kg</p>
                </div>
              </div>
            </Panel>
          );
        })}
      </div>

      <Panel className="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-6">
          <h2 className="font-serif text-2xl">Market &amp; buyer comparison</h2>
          <div className="flex gap-2">
            {(["all", "buyers", "mandis"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm capitalize",
                  tab === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                {["Channel", "Price/kg", "Transport", "Storage", "Demand", "Reliability", "Net/kg"].map(
                  (h) => (
                    <th key={h} className="px-6 py-3 font-medium">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.key} className={cn("border-b border-border/60", i === 0 && "bg-accent/50")}>
                  <td className="px-6 py-4">
                    <p className="font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.sub}</p>
                  </td>
                  <td className="px-6 py-4">{inr(r.price)}</td>
                  <td className="px-6 py-4">{inr(r.transport)}</td>
                  <td className="px-6 py-4">{r.storage ? inr(r.storage) : "—"}</td>
                  <td className="px-6 py-4">{r.demand}</td>
                  <td className="px-6 py-4">{r.reliability}/100</td>
                  <td className="px-6 py-4 font-serif text-lg">{inr(r.net)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </PortalLayout>
  );
}
