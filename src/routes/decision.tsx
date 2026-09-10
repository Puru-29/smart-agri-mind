import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CheckCircle2, Sparkles } from "lucide-react";
import { PortalLayout } from "@/components/agri/portal-layout";
import { Bar as ScoreBar, PageHeader, Panel, Pill, StatusTag } from "@/components/agri/ui-bits";
import { useFarmLocation } from "@/lib/location-context";
import { buildComparison, inr, kg, LOTS, SIGNALS } from "@/services";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/decision")({
  head: () => ({
    meta: [
      { title: "AI Decision Engine — AgriSense" },
      { name: "description", content: "Six weighted signals scored into a sell, hold or split recommendation." },
      { property: "og:title", content: "AI Decision Engine — AgriSense" },
      { property: "og:description", content: "See exactly why AgriSense recommends selling, holding or splitting." },
    ],
  }),
  component: Decision,
});

function Decision() {
  const { location } = useFarmLocation();
  const [lotId, setLotId] = useState(LOTS[0]!.id);
  const lot = LOTS.find((l) => l.id === lotId)!;
  const rows = buildComparison(location).slice(0, 5);
  const chartData = rows.map((r) => ({ name: r.name.split("—")[0]!.trim(), offer: r.price, net: r.net }));

  return (
    <PortalLayout>
      <PageHeader
        eyebrow="AI decision engine"
        title="Decision breakdown"
        description="Every channel priced from your farm gate, then scored across six weighted signals."
      />

      <div className="flex flex-wrap gap-2">
        {LOTS.map((l) => (
          <button
            key={l.id}
            onClick={() => setLotId(l.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm",
              lotId === l.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground",
            )}
          >
            {l.emoji} {l.crop} · {l.id}
          </button>
        ))}
      </div>

      <Panel className="bg-primary text-primary-foreground">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Pill className="bg-primary-foreground/15 text-primary-foreground">
              <Sparkles className="h-3.5 w-3.5" /> Recommendation
            </Pill>
            <h2 className="mt-4 font-serif text-3xl">
              {lot.status} · {lot.crop} {lot.id}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-primary-foreground/75">
              {kg(lot.quantity)} at {lot.grade}. Best net realization today is {inr(rows[0]!.net)}/kg
              via {rows[0]!.name} ({rows[0]!.km} km). Confidence {lot.confidence}%.
            </p>
          </div>
          <StatusTag status={lot.status} />
        </div>
      </Panel>

      <Panel>
        <h2 className="font-serif text-2xl">Offer price vs net realization</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The highest offer is rarely the highest earning once freight and storage are deducted.
        </p>
        <div className="mt-6 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                }}
              />
              <Bar dataKey="offer" fill="var(--color-sage)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="net" radius={[6, 6, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill="var(--color-forest)" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel>
        <h2 className="font-serif text-2xl">Six-signal weighted analysis</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {SIGNALS.map((s) => (
            <div key={s.title}>
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-medium">{s.title}</p>
                <span className="text-sm text-muted-foreground">{s.score}/100</span>
              </div>
              <p className="mt-1 text-sm">{s.head}</p>
              <p className="text-xs text-muted-foreground">{s.sub}</p>
              <div className="mt-2">
                <ScoreBar value={s.score} tone={s.score < 50 ? "amber" : "primary"} />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-5 md:grid-cols-3">
        {[
          {
            tag: "SELL NOW" as const,
            score: 88,
            body: `Accept ${rows[0]!.name} at ${inr(rows[0]!.price)}/kg. Net ${inr(rows[0]!.net)}/kg after freight.`,
          },
          {
            tag: "HOLD" as const,
            score: 46,
            body: "Forecast band widens after 26 Sep and tomato spoilage runs 6% per week in storage.",
          },
          {
            tag: "SPLIT" as const,
            score: 64,
            body: "Move 3,000 kg now to cover input cost, hold 2,000 kg for the festival window.",
          },
        ].map((c) => (
          <Panel key={c.tag} className={cn(c.tag === lot.status && "border-primary")}>
            <div className="flex items-center justify-between">
              <StatusTag status={c.tag} />
              <span className="text-sm text-muted-foreground">{c.score}/100</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{c.body}</p>
            {c.tag === lot.status ? (
              <p className="mt-4 flex items-center gap-2 text-sm text-primary">
                <CheckCircle2 className="h-4 w-4" /> Recommended
              </p>
            ) : null}
          </Panel>
        ))}
      </div>

      <Panel className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl">Act on this decision</h2>
          <p className="text-sm text-muted-foreground">
            Accepting locks the offer and books a tempo from {location.name}.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground">
            Accept best offer
          </button>
          <button className="rounded-full border border-border px-5 py-2.5 text-sm">
            Schedule pickup
          </button>
          <button className="rounded-full border border-border px-5 py-2.5 text-sm">
            Notify FPO
          </button>
        </div>
      </Panel>
    </PortalLayout>
  );
}
