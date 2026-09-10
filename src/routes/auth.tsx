import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Building2, ShieldCheck, Sprout, Store, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { LocationSelector } from "@/components/agri/location-selector";
import { LanguageSelector } from "@/components/agri/language-selector";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — AgriSense" },
      { name: "description", content: "Sign in to AgriSense as a farmer, buyer, FPO or admin." },
      { property: "og:title", content: "Sign in — AgriSense" },
      { property: "og:description", content: "Access your AgriSense market intelligence portal." },
    ],
  }),
  component: AuthPage,
});

const ROLES = [
  { id: "farmer", label: "Farmer", icon: Sprout, sub: "Sell your crop lots" },
  { id: "buyer", label: "Buyer", icon: Store, sub: "Source verified produce" },
  { id: "fpo", label: "FPO", icon: Building2, sub: "Aggregate member lots" },
  { id: "admin", label: "Admin", icon: ShieldCheck, sub: "Manage the network" },
];

function AuthPage() {
  const [role, setRole] = useState("farmer");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-lg">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sprout className="h-4 w-4" />
          </span>
          <span className="font-serif text-xl">AgriSense</span>
        </Link>

        <div className="mb-4 flex justify-center">
          <LanguageSelector />
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-8">
          <h1 className="font-serif text-3xl">{t("Welcome back")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("Choose your role and sign in with the phone number registered with your mandi.")}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={cn(
                  "rounded-2xl border p-4 text-left transition-colors",
                  role === r.id
                    ? "border-primary bg-accent"
                    : "border-border bg-background hover:bg-secondary",
                )}
              >
                <r.icon className="h-4 w-4 text-primary" />
                <p className="mt-2 text-sm font-medium">{t(r.label)}</p>
                <p className="text-xs text-muted-foreground">{t(r.sub)}</p>
              </button>
            ))}
          </div>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/dashboard" });
            }}
          >
            <div>
              <label className="text-sm text-muted-foreground" htmlFor="phone">
                {t("Phone number")}
              </label>
              <input
                id="phone"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98XXXXXXXX"
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground" htmlFor="pin">
                {t("4-digit PIN")}
              </label>
              <input
                id="pin"
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">{t("Farm location")}</span>
              <LocationSelector compact />
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
            >
              {t("Sign in")} <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <button
            onClick={() => navigate({ to: "/dashboard" })}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-sm"
          >
            <User className="h-4 w-4" /> {t("Continue as demo farmer (Ramesh)")}
          </button>
        </div>
      </div>
    </div>
  );
}
