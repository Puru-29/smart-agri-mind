import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, MapPin } from "lucide-react";
import { PortalLayout } from "@/components/agri/portal-layout";
import { Bar as ScoreBar, Metric, PageHeader, Panel, Pill } from "@/components/agri/ui-bits";
import { BUYERS, inr, kg, LOTS, roadKm, transportPerKg } from "@/lib/agri";
import { useFarmLocation } from "@/lib/location-context";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/buyers")({
  head: () => ({
    meta: [
      { title: "Buyers — AgriSense" },
      { name: "description", content: "Verified buyers with reliability scores, payment terms and expected net earnings." },
      { property: "og:title", content: "Buyers — AgriSense" },
      { property: "og:description", content: "Discover processors, exporters and retail chains buying near you." },
    ],
  }),
  component: Buyers,
});

const SORTS = ["Net earning", "Distance", "Reliability"] as const;

function Buyers() {
  const { location } = useFarmLocation();
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Net earning");
  const lot = LOTS[0]!;

  const enriched = BUYERS.map((b) => {
    const km = roadKm(location, b);
    const freight = transportPerKg(km);
    const qty = Math.min(b.demandKg, lot.quantity);
    return { ...b, km, freight, net: Math.round((b.offer - freight) * qty), netKg: Math.round((b.offer - freight) * 10) / 10, qty };
  }).sort((a, b) =>
    sort === "Distance" ? a.km - b.km : sort === "Reliability" ? b.reliability - a.reliability : b.netKg - a.netKg,
  );

  return (
    <PortalLayout>
      <PageHeader
        eyebrow="Buyer directory"
        title="Buyers near your farm"
        description={`Net earnings calculated for ${lot.crop} ${lot.grade} shipped from ${location.name}.`}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Active buyers" value={BUYERS.length} hint="Within 200 km" />
        <Metric label="Total requirement" value={kg(BUYERS.reduce((s, b) => s + b.demandKg, 0))} hint="This week" />
        <Metric label="Best net" value={`${inr(enriched[0]!.netKg)}/kg`} hint={enriched[0]!.name} />
      </div>

      <div className="flex flex-wrap gap-2">
        {SORTS.map((s) => (
          <button
            key={s}
            onClick={() => setSort(s)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm",
              sort === s
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground",
            )}
          >
            Sort: {s}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {enriched.map((b) => (
          <Panel key={b.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-serif text-xl">{b.name}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {b.city} · {b.km} km · {b.type}
                </p>
              </div>
              {b.verified ? (
                <Pill tone="green">
                  <BadgeCheck className="h-3.5 w-3.5" /> Verified
                </Pill>
              ) : null}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              {[
                ["Offer", `${inr(b.offer)}/kg`],
                ["Freight", `${inr(b.freight)}/kg`],
                ["Net", `${inr(b.netKg)}/kg`],
                ["Requirement", kg(b.demandKg)],
              ].map(([l, v]) => (
                <div key={l}>
                  <p className="text-xs text-muted-foreground">{l}</p>
                  <p className="mt-0.5">{v}</p>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <div className="flex items-baseline justify-between text-xs text-muted-foreground">
                <span>Reliability</span>
                <span>{b.reliability}/100</span>
              </div>
              <div className="mt-2">
                <ScoreBar value={b.reliability} />
              </div>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">Payment terms · {b.terms}</p>
            <p className="mt-1 text-sm">
              Expected earning on {kg(b.qty)}:{" "}
              <span className="font-serif text-lg">{inr(b.net)}</span>
            </p>

            <div className="mt-5 flex gap-3">
              <button className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">
                Accept offer
              </button>
              <button className="rounded-full border border-border px-4 py-2 text-sm">
                Message buyer
              </button>
            </div>
          </Panel>
        ))}
      </div>
    </PortalLayout>
  );
}
