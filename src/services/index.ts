/**
 * Service layer. All UI reads data through these functions so that swapping the
 * mock adapter for a real backend only requires changes in this folder.
 */
import {
  BUYERS,
  DRIVERS,
  FORECAST,
  LOCATIONS,
  LOTS,
  MARKETS,
  ORDERS,
  ORDER_TIMELINE,
  PAYMENTS,
  SIGNALS,
  TRACKING_EVENTS,
  buildComparison,
  roadKm,
  transportPerKg,
} from "@/lib/agri";
import type { Coords } from "@/lib/agri";
import {
  FAQS,
  FPO_POOLS,
  NOTIFICATION_FEED,
  PROFILE,
  TESTIMONIALS,
  TICKER,
  TRUST_METRICS,
} from "./mock-data";
import type { AppNotification, FarmerProfile } from "./types";

export * from "./types";

/**
 * Static collections and helpers, re-exported so UI code has a single import
 * surface. Replace the bodies in this folder to move onto a real backend.
 */
export {
  BUYERS,
  DEFAULT_LOCATION,
  DRIVERS,
  FORECAST,
  LOCATIONS,
  LOTS,
  MARKETS,
  NOTIFICATIONS,
  ORDERS,
  ORDER_TIMELINE,
  PAYMENTS,
  SIGNALS,
  TRACKING_EVENTS,
  buildComparison,
  haversine,
  inr,
  kg,
  roadKm,
  transportPerKg,
} from "@/lib/agri";

/** Simulated network latency for the mock adapter. */
const delay = <T,>(value: T, ms = 120): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

/* ---------------------------------------------------------------- catalogue */

export const fetchLocations = () => delay(LOCATIONS);
export const fetchCropLots = () => delay(LOTS);
export const fetchMarkets = () => delay(MARKETS);
export const fetchBuyers = () => delay(BUYERS);
export const fetchOrders = () => delay(ORDERS);
export const fetchOrderTimeline = () => delay(ORDER_TIMELINE);
export const fetchTrackingEvents = () => delay(TRACKING_EVENTS);
export const fetchPayments = () => delay(PAYMENTS);
export const fetchForecast = () => delay(FORECAST);
export const fetchSignals = () => delay(SIGNALS);
export const fetchPriceDrivers = () => delay(DRIVERS);
export const fetchComparison = (from: Coords) => delay(buildComparison(from));

/** Synchronous accessors used by components that render during SSR. */
export const cropLots = () => LOTS;
export const markets = () => MARKETS;
export const buyers = () => BUYERS;
export const orders = () => ORDERS;
export const payments = () => PAYMENTS;
export const locations = () => LOCATIONS;

/* ------------------------------------------------------------------ profile */

let profileState: FarmerProfile = PROFILE;

export const getProfile = () => profileState;
export const fetchProfile = () => delay(profileState);
export const updateProfile = async (patch: Partial<FarmerProfile>) => {
  profileState = { ...profileState, ...patch };
  return delay(profileState, 200);
};

/* ------------------------------------------------------------ notifications */

export const getNotifications = () => NOTIFICATION_FEED;
export const fetchNotifications = () => delay(NOTIFICATION_FEED);

/* ---------------------------------------------------------------------- FPO */

export const getFpoPools = () => FPO_POOLS;
export const fetchFpoPools = () => delay(FPO_POOLS);

/* ------------------------------------------------------------------ landing */

export const getTicker = () => TICKER;
export const getTestimonials = () => TESTIMONIALS;
export const getFaqs = () => FAQS;
export const getTrustMetrics = () => TRUST_METRICS;

/* -------------------------------------------------------------- calculators */

export type NetRealizationInput = {
  crop: string;
  quantityKg: number;
  from: Coords;
};

export type NetRealizationResult = {
  headline: number;
  freightPerKg: number;
  storagePerKg: number;
  netPerKg: number;
  km: number;
  destination: string;
  totalNet: number;
  totalHeadline: number;
};

const CROP_PRICE: Record<string, number> = {
  Tomato: 30,
  Onion: 18,
  Soybean: 46,
  Pomegranate: 92,
};

export const CALCULATOR_CROPS = Object.keys(CROP_PRICE);

export function calculateNetRealization({
  crop,
  quantityKg,
  from,
}: NetRealizationInput): NetRealizationResult {
  const base = CROP_PRICE[crop] ?? 30;
  const best = BUYERS.map((b) => {
    const km = roadKm(from, b);
    const freight = transportPerKg(km);
    const headline = Math.round((base * (b.offer / 30)) * 10) / 10;
    return { name: b.name, km, freight, headline, net: headline - freight };
  }).sort((a, b) => b.net - a.net)[0]!;

  const storagePerKg = 0;
  const netPerKg = Math.round((best.net - storagePerKg) * 10) / 10;
  return {
    headline: best.headline,
    freightPerKg: best.freight,
    storagePerKg,
    netPerKg,
    km: best.km,
    destination: best.name,
    totalNet: Math.round(netPerKg * quantityKg),
    totalHeadline: Math.round(best.headline * quantityKg),
  };
}

export type AggregationResult = {
  pooledKg: number;
  soloNetPerKg: number;
  pooledNetPerKg: number;
  gainPerKg: number;
  totalGain: number;
};

export function aggregateLots(
  poolId: string,
  memberIds: string[],
): AggregationResult | null {
  const pool = FPO_POOLS.find((p) => p.id === poolId);
  if (!pool) return null;
  const pooledKg = pool.members
    .filter((m) => memberIds.includes(m.id))
    .reduce((sum, m) => sum + m.quantity, 0);
  const qualifies = pooledKg >= pool.targetKg * 0.8;
  const soloNetPerKg = Math.round((pool.basePrice - pool.soloFreight) * 10) / 10;
  const pooledNetPerKg = qualifies
    ? Math.round((pool.bulkPrice - pool.pooledFreight) * 10) / 10
    : soloNetPerKg;
  const gainPerKg = Math.round((pooledNetPerKg - soloNetPerKg) * 10) / 10;
  return {
    pooledKg,
    soloNetPerKg,
    pooledNetPerKg,
    gainPerKg,
    totalGain: Math.round(gainPerKg * pooledKg),
  };
}

export type { AppNotification };

/* -------------------------------------------- cold chain & virtual assistant */

import {
  BOT_ANSWERS,
  BOT_FALLBACK,
  BOT_GREETING,
  COLD_CHAIN_FACILITIES,
} from "./mock-data";

export { BOT_ANSWERS, BOT_FALLBACK, BOT_GREETING, COLD_CHAIN_FACILITIES };

export const getFacilities = () => COLD_CHAIN_FACILITIES;
export const fetchFacilities = () => delay(COLD_CHAIN_FACILITIES);
export const getBotAnswers = () => BOT_ANSWERS;
export const fetchBotAnswers = () => delay(BOT_ANSWERS);

/** Very small keyword matcher standing in for a future NLU backend. */
export function askAgriBot(question: string, lang: "en" | "hi" | "mr") {
  const q = question.toLowerCase();
  const has = (...keys: string[]) => keys.some((k) => q.includes(k));
  const pick = (id: string) => BOT_ANSWERS.find((a) => a.id === id)?.answer[lang];

  if (has("onion", "कांदा", "कांद्या", "प्याज")) return pick("onion-rate")!;
  if (has("soy", "सोयाबीन")) return pick("soybean-timing")!;
  if (has("tomato", "टोमॅटो", "टमाटर", "pune", "पुणे")) return pick("pune-tomato")!;
  if (has("grad", "ग्रेड", "quality", "गुणवत्ता")) return pick("ai-grading")!;
  return BOT_FALLBACK[lang];
}

/** Freight + storage estimate for the cold chain calculator. */
export function estimateFreight(input: {
  km: number;
  quintals: number;
  ratePerKm: number;
  storageDays?: number;
  storagePerQuintalPerDay?: number;
}) {
  const trips = Math.max(1, Math.ceil(input.quintals / 180));
  const freight = Math.round(input.km * input.ratePerKm * trips);
  const storage = Math.round(
    (input.storageDays ?? 0) * (input.storagePerQuintalPerDay ?? 0) * input.quintals,
  );
  const kgTotal = input.quintals * 100;
  return {
    trips,
    freight,
    storage,
    total: freight + storage,
    perKg: kgTotal > 0 ? Math.round(((freight + storage) / kgTotal) * 100) / 100 : 0,
  };
}
