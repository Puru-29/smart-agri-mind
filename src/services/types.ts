/**
 * Shared domain models. UI code should import types from here (or `@/services`),
 * never from the mock data modules directly.
 */
export type {
  Buyer,
  Coords,
  Lot,
  LotStatus,
  Market,
  Place,
  Row,
} from "@/lib/agri";

export type KycStatus = "verified" | "pending" | "unverified";

export type FarmerProfile = {
  id: string;
  name: string;
  phone: string;
  email: string;
  language: string;
  village: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  landholdingAcres: number;
  primaryCrops: string;
  soilType: string;
  irrigation: string;
  kyc: KycStatus;
  bank: {
    holder: string;
    accountNumber: string;
    ifsc: string;
    upiId: string;
    autoSettlement: boolean;
  };
  notifications: {
    priceAlerts: boolean;
    buyerBids: boolean;
    logistics: boolean;
    settlements: boolean;
    whatsapp: boolean;
  };
};

export type NotificationCategory = "price" | "bids" | "logistics" | "settlements";

export type AppNotification = {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  time: string;
  read: boolean;
  link: { to: string; label: string };
};

export type FpoMember = {
  id: string;
  name: string;
  village: string;
  crop: string;
  grade: string;
  quantity: number;
};

export type FpoBid = {
  id: string;
  buyer: string;
  pricePerKg: number;
  minQuantity: number;
  terms: string;
  status: "Open" | "Negotiating" | "Accepted";
};

export type FpoPool = {
  id: string;
  crop: string;
  emoji: string;
  targetKg: number;
  basePrice: number;
  bulkPrice: number;
  soloFreight: number;
  pooledFreight: number;
  contractStatus: "Draft" | "Open for pooling" | "Contract signed";
  members: FpoMember[];
  bids: FpoBid[];
  payouts: { member: string; quantity: number; amount: number; status: "Paid" | "Scheduled" }[];
};

export type Testimonial = {
  name: string;
  place: string;
  crop: string;
  quote: string;
  gain: string;
};

export type TickerQuote = {
  crop: string;
  mandi: string;
  price: number;
  change: number;
};

export type Faq = { q: string; a: string };
