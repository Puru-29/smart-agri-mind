import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { BadgeCheck, MapPin, Save } from "lucide-react";
import { PortalLayout } from "@/components/agri/portal-layout";
import { PageHeader, Panel, Pill } from "@/components/agri/ui-bits";
import { getProfile, updateProfile, type FarmerProfile } from "@/services";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile & settlement details — AgriSense" },
      {
        name: "description",
        content:
          "Personal details, farm records, bank and settlement account, notification preferences and KYC status.",
      },
      { property: "og:title", content: "Profile & settlement details — AgriSense" },
      {
        property: "og:description",
        content: "Keep farm, bank and alert preferences up to date for accurate payouts.",
      },
    ],
  }),
  component: ProfilePage,
});

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
      />
    </label>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-border bg-background px-4 py-3 text-left"
    >
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {hint ? <span className="block text-xs text-muted-foreground">{hint}</span> : null}
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-secondary"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-card transition-all ${
            checked ? "left-[1.375rem]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}

function ProfilePage() {
  const [profile, setProfile] = useState<FarmerProfile>(() => getProfile());

  const set = <K extends keyof FarmerProfile>(key: K, value: FarmerProfile[K]) =>
    setProfile((p) => ({ ...p, [key]: value }));

  const save = async (section: string) => {
    await updateProfile(profile);
    toast.success(`${section} saved`, { description: "Changes stored on this device." });
  };

  return (
    <PortalLayout>
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Personal, farm, settlement and alert details used across every decision on AgriSense."
        action={
          <Pill tone="green">
            <BadgeCheck className="h-3.5 w-3.5" />
            KYC {profile.kyc}
          </Pill>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel className="space-y-4">
          <h2 className="font-serif text-2xl">Personal details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" value={profile.name} onChange={(v) => set("name", v)} />
            <Field label="Mobile number" value={profile.phone} onChange={(v) => set("phone", v)} />
            <Field label="Email" value={profile.email} onChange={(v) => set("email", v)} />
            <Field label="Language" value={profile.language} onChange={(v) => set("language", v)} />
          </div>
          <button
            onClick={() => save("Personal details")}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground"
          >
            <Save className="h-4 w-4" /> Save personal details
          </button>
        </Panel>

        <Panel className="space-y-4">
          <h2 className="font-serif text-2xl">Farm details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Village" value={profile.village} onChange={(v) => set("village", v)} />
            <Field label="District" value={profile.district} onChange={(v) => set("district", v)} />
            <Field
              label="Landholding (acres)"
              type="number"
              value={profile.landholdingAcres}
              onChange={(v) => set("landholdingAcres", Number(v) || 0)}
            />
            <Field
              label="Primary crops"
              value={profile.primaryCrops}
              onChange={(v) => set("primaryCrops", v)}
            />
            <Field label="Soil type" value={profile.soilType} onChange={(v) => set("soilType", v)} />
            <Field
              label="Irrigation"
              value={profile.irrigation}
              onChange={(v) => set("irrigation", v)}
            />
            <Field
              label="Latitude"
              type="number"
              value={profile.lat}
              onChange={(v) => set("lat", Number(v) || 0)}
            />
            <Field
              label="Longitude"
              type="number"
              value={profile.lng}
              onChange={(v) => set("lng", Number(v) || 0)}
            />
          </div>
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            Farm gate at {profile.lat}, {profile.lng} · {profile.village}, {profile.district},{" "}
            {profile.state}
          </p>
          <button
            onClick={() => save("Farm details")}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground"
          >
            <Save className="h-4 w-4" /> Save farm details
          </button>
        </Panel>

        <Panel className="space-y-4">
          <h2 className="font-serif text-2xl">Bank &amp; settlement</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Account holder"
              value={profile.bank.holder}
              onChange={(v) => set("bank", { ...profile.bank, holder: v })}
            />
            <Field
              label="Account number"
              value={profile.bank.accountNumber}
              onChange={(v) => set("bank", { ...profile.bank, accountNumber: v })}
            />
            <Field
              label="IFSC"
              value={profile.bank.ifsc}
              onChange={(v) => set("bank", { ...profile.bank, ifsc: v })}
            />
            <Field
              label="UPI ID"
              value={profile.bank.upiId}
              onChange={(v) => set("bank", { ...profile.bank, upiId: v })}
            />
          </div>
          <Toggle
            label="Auto-settlement"
            hint="Release balance automatically on delivery confirmation"
            checked={profile.bank.autoSettlement}
            onChange={(v) => set("bank", { ...profile.bank, autoSettlement: v })}
          />
          <button
            onClick={() => save("Settlement account")}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground"
          >
            <Save className="h-4 w-4" /> Save settlement account
          </button>
        </Panel>

        <Panel className="space-y-4">
          <h2 className="font-serif text-2xl">Notification preferences</h2>
          <div className="space-y-3">
            <Toggle
              label="Price alerts"
              hint="Mandi price moves above your threshold"
              checked={profile.notifications.priceAlerts}
              onChange={(v) => set("notifications", { ...profile.notifications, priceAlerts: v })}
            />
            <Toggle
              label="Buyer bids"
              hint="New or raised offers on your lots"
              checked={profile.notifications.buyerBids}
              onChange={(v) => set("notifications", { ...profile.notifications, buyerBids: v })}
            />
            <Toggle
              label="Logistics updates"
              hint="Pickup, transit and delivery events"
              checked={profile.notifications.logistics}
              onChange={(v) => set("notifications", { ...profile.notifications, logistics: v })}
            />
            <Toggle
              label="Settlement updates"
              hint="Advances, balances and payment references"
              checked={profile.notifications.settlements}
              onChange={(v) => set("notifications", { ...profile.notifications, settlements: v })}
            />
            <Toggle
              label="WhatsApp delivery"
              hint="Send the same alerts on WhatsApp"
              checked={profile.notifications.whatsapp}
              onChange={(v) => set("notifications", { ...profile.notifications, whatsapp: v })}
            />
          </div>
          <button
            onClick={() => save("Notification preferences")}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground"
          >
            <Save className="h-4 w-4" /> Save preferences
          </button>
        </Panel>
      </div>
    </PortalLayout>
  );
}
