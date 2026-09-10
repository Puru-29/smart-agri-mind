import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, MapPin, Plus, Truck } from "lucide-react";
import { PortalLayout } from "@/components/agri/portal-layout";
import { PageHeader, Panel, Pill, StatusTag } from "@/components/agri/ui-bits";
import { useFarmLocation } from "@/lib/location-context";
import { inr, kg, LOTS, roadKm, transportPerKg } from "@/services";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/crops")({
  head: () => ({
    meta: [
      { title: "My Crops — AgriSense" },
      { name: "description", content: "Every registered crop lot with its sell, hold or split status." },
      { property: "og:title", content: "My Crops — AgriSense" },
      { property: "og:description", content: "Track quantity, grade, price and distance for each lot." },
    ],
  }),
  component: Crops,
});

const FILTERS = ["All lots", "SELL NOW", "HOLD", "SPLIT"] as const;

function Crops() {
  const { location } = useFarmLocation();
  const { t } = useI18n();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All lots");
  const lots = filter === "All lots" ? LOTS : LOTS.filter((l) => l.status === filter);

  return (
    <PortalLayout>
      <PageHeader
        eyebrow="Portfolio"
        title="My crops"
        description={`All lots priced from ${location.name}, ${location.district}. Distance and freight update when you change your farm location.`}
        action={
          <button className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground">
            <Plus className="h-4 w-4" /> {t("Register lot")}
          </button>
        }
      />

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors",
              filter === f
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground",
            )}
          >
            {t(f)}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {lots.map((lot) => {
          const km = roadKm(location, lot.place);
          const freight = transportPerKg(km);
          const net = Math.round((lot.price - freight - lot.storagePerKg) * 10) / 10;
          return (
            <Panel key={lot.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-2xl">
                    {lot.emoji}
                  </span>
                  <div>
                    <p className="font-serif text-2xl">{t(lot.crop)}</p>
                    <p className="text-xs text-muted-foreground">
                      {lot.id} · {lot.grade} · {lot.stateLabel}
                    </p>
                  </div>
                </div>
                <StatusTag status={lot.status} />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                {[
                  ["Quantity", kg(lot.quantity)],
                  ["Offer", `${inr(lot.price)}/kg`],
                  ["Freight", `${inr(freight)}/kg`],
                  ["Net", `${inr(net)}/kg`],
                ].map(([l, v]) => (
                  <div key={l}>
                    <p className="text-xs text-muted-foreground">{t(l!)}</p>
                    <p className="mt-0.5">{v}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
                <Pill>
                  <MapPin className="h-3.5 w-3.5" /> {lot.place.name} · {km} km
                </Pill>
                <Pill>
                  <CalendarDays className="h-3.5 w-3.5" /> {t("Harvest")} {lot.harvest}
                </Pill>
                <Pill>
                  <Truck className="h-3.5 w-3.5" /> {lot.confidence}% {t("confidence")}
                </Pill>
              </div>

              <div className="mt-5 flex gap-3">
                <Link
                  to="/decision"
                  className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground"
                >
                  {t("View decision")}
                </Link>
                <Link to="/buyers" className="rounded-full border border-border px-4 py-2 text-sm">
                  {t("Find buyers")}
                </Link>
              </div>
            </Panel>
          );
        })}
      </div>
    </PortalLayout>
  );
}
