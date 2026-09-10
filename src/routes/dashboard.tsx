import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Boxes, IndianRupee, MapPin, TrendingUp, Truck } from "lucide-react";
import { PortalLayout } from "@/components/agri/portal-layout";
import { Metric, Panel, Pill, StatusTag } from "@/components/agri/ui-bits";
import { useFarmLocation } from "@/lib/location-context";
import { BUYERS, inr, kg, LOTS, MARKETS, roadKm, transportPerKg } from "@/lib/agri";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Farmer Dashboard — AgriSense" },
      {
        name: "description",
        content: "Active lots, AI market decisions, mandi opportunities and buyer offers.",
      },
      { property: "og:title", content: "Farmer Dashboard — AgriSense" },
      { property: "og:description", content: "Your crop lots and today's best selling decision." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { location } = useFarmLocation();
  const hero = LOTS[0]!;
  const bestBuyer = BUYERS[0]!;
  const buyerKm = roadKm(location, bestBuyer);
  const freight = transportPerKg(buyerKm);
  const net = (bestBuyer.offer - freight) * hero.quantity;
  const totalKg = LOTS.reduce((s, l) => s + l.quantity, 0);
  const totalValue = LOTS.reduce((s, l) => s + l.quantity * l.price, 0);

  return (
    <PortalLayout>
      <div>
        <p className="eyebrow">{new Date().toDateString()}</p>
        <h1 className="mt-2 font-serif text-4xl">Namaste, Ramesh 🙏</h1>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" /> {location.name}, {location.district}, {location.state} ·{" "}
          {location.belt}
        </p>
      </div>

      {/* AI decision hero */}
      <Panel className="bg-primary text-primary-foreground">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Pill className="bg-primary-foreground/15 text-primary-foreground">
              AI market decision
            </Pill>
            <h2 className="mt-4 font-serif text-3xl">
              Sell {kg(hero.quantity)} of {hero.crop} today at {inr(bestBuyer.offer)}/kg
            </h2>
            <p className="mt-2 max-w-xl text-sm text-primary-foreground/75">
              {bestBuyer.name} is {buyerKm} km from {location.name}. After {inr(freight)}/kg
              transport your net realization is {inr(net)} — {hero.confidence}% confidence.
            </p>
          </div>
          <StatusTag status={hero.status} />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            ["Offer price", `${inr(bestBuyer.offer)}/kg`],
            ["Transport", `${inr(freight)}/kg · ${buyerKm} km`],
            ["Net realization", inr(net)],
          ].map(([l, v]) => (
            <div key={l} className="rounded-2xl bg-primary-foreground/10 p-4">
              <p className="text-xs text-primary-foreground/70">{l}</p>
              <p className="mt-1 font-serif text-2xl">{v}</p>
            </div>
          ))}
        </div>
        <Link
          to="/decision"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-foreground px-5 py-2.5 text-sm font-medium text-primary"
        >
          View full breakdown <ArrowRight className="h-4 w-4" />
        </Link>
      </Panel>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Active lots" value={LOTS.length} hint={kg(totalKg) + " registered"} icon={<Boxes className="h-4 w-4" />} />
        <Metric label="Portfolio value" value={inr(totalValue)} hint="At current offers" icon={<IndianRupee className="h-4 w-4" />} />
        <Metric label="Best mandi gain" value="+6.1%" hint="Mumbai Vashi APMC" icon={<TrendingUp className="h-4 w-4" />} />
        <Metric label="Avg transport" value={inr(freight) + "/kg"} hint={`${buyerKm} km to nearest buyer`} icon={<Truck className="h-4 w-4" />} />
      </div>

      {/* Crop lots */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl">Your crop lots</h2>
          <Link to="/crops" className="text-sm underline underline-offset-4">
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {LOTS.map((lot) => {
            const km = roadKm(location, lot.place);
            return (
              <Panel key={lot.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lot.emoji}</span>
                    <div>
                      <p className="font-serif text-xl">{lot.crop}</p>
                      <p className="text-xs text-muted-foreground">
                        {lot.id} · {lot.grade}
                      </p>
                    </div>
                  </div>
                  <StatusTag status={lot.status} />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Quantity</p>
                    <p>{kg(lot.quantity)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p>{inr(lot.price)}/kg</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Distance</p>
                    <p>{km} km</p>
                  </div>
                </div>
              </Panel>
            );
          })}
        </div>
      </section>

      {/* Market opportunities */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-serif text-2xl">Market opportunities</h2>
          {MARKETS.slice(0, 4).map((m) => {
            const km = roadKm(location, m);
            const freightKg = transportPerKg(km);
            return (
              <Panel key={m.id} className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {km} km · {inr(freightKg)}/kg freight · {m.demand} demand
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-xl">{inr(m.price)}/kg</p>
                  <p className={m.trend >= 0 ? "text-xs text-primary" : "text-xs text-clay"}>
                    {m.trend >= 0 ? "+" : ""}
                    {m.trend}%
                  </p>
                </div>
              </Panel>
            );
          })}
        </div>
        <div className="space-y-4">
          <h2 className="font-serif text-2xl">Buyer opportunities</h2>
          {BUYERS.map((b) => {
            const km = roadKm(location, b);
            return (
              <Panel key={b.id} className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-medium">{b.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {b.type} · {km} km · {b.terms}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-xl">{inr(b.offer)}/kg</p>
                  <Pill tone="green">{b.reliability}/100</Pill>
                </div>
              </Panel>
            );
          })}
        </div>
      </section>
    </PortalLayout>
  );
}
