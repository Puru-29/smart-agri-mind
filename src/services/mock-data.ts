import type {
  AppNotification,
  Faq,
  FarmerProfile,
  FpoPool,
  Testimonial,
  TickerQuote,
} from "./types";

export const PROFILE: FarmerProfile = {
  id: "FARM-1042",
  name: "Ramesh Patil",
  phone: "+91 98765 43210",
  email: "ramesh.patil@agrisense.in",
  language: "Marathi",
  village: "Dindori",
  district: "Nashik",
  state: "Maharashtra",
  lat: 20.2,
  lng: 73.83,
  landholdingAcres: 6.5,
  primaryCrops: "Tomato, Onion, Soybean",
  soilType: "Black cotton (regur)",
  irrigation: "Drip · borewell",
  kyc: "verified",
  bank: {
    holder: "Ramesh Sitaram Patil",
    accountNumber: "XXXX XXXX 4412",
    ifsc: "MAHB0001129",
    upiId: "ramesh.patil@upi",
    autoSettlement: true,
  },
  notifications: {
    priceAlerts: true,
    buyerBids: true,
    logistics: true,
    settlements: true,
    whatsapp: false,
  },
};

export const NOTIFICATION_FEED: AppNotification[] = [
  {
    id: "N-01",
    category: "bids",
    title: "Buyer A raised the offer to ₹30/kg",
    body: "Sahyadri Foods needs 6,000 kg of Grade A tomato this week.",
    time: "14 minutes ago",
    read: false,
    link: { to: "/buyers", label: "View buyer" },
  },
  {
    id: "N-02",
    category: "price",
    title: "Nashik APMC arrivals down 12%",
    body: "Tomato prices firmed to ₹28/kg — net realization now ₹26/kg.",
    time: "2 hours ago",
    read: false,
    link: { to: "/markets", label: "See markets" },
  },
  {
    id: "N-03",
    category: "logistics",
    title: "Consignment TRK-3391 departed Dindori",
    body: "12 km covered · expected at Nashik MIDC by 13:00.",
    time: "4 hours ago",
    read: false,
    link: { to: "/logistics", label: "Track consignment" },
  },
  {
    id: "N-04",
    category: "settlements",
    title: "₹75,000 advance credited",
    body: "50% advance for ORD-8841 received · UTR 4429183021.",
    time: "Yesterday",
    read: true,
    link: { to: "/payments", label: "Open settlement" },
  },
  {
    id: "N-05",
    category: "price",
    title: "Forecast updated for tomato",
    body: "Peak of ₹31.5/kg expected in the week of 26 Sep.",
    time: "Yesterday",
    read: true,
    link: { to: "/forecast", label: "See forecast" },
  },
  {
    id: "N-06",
    category: "logistics",
    title: "Shared tempo available on 16 Sep",
    body: "Open tempo · 6 t capacity for the Lasalgaon route.",
    time: "2 days ago",
    read: true,
    link: { to: "/logistics", label: "View logistics" },
  },
  {
    id: "N-07",
    category: "bids",
    title: "GreenLeaf Exports enquired for pomegranate",
    body: "Export grade · 3,000 kg at ₹94/kg, Net 15 days.",
    time: "3 days ago",
    read: true,
    link: { to: "/buyers", label: "View buyer" },
  },
];

export const FPO_POOLS: FpoPool[] = [
  {
    id: "POOL-TOM-01",
    crop: "Tomato",
    emoji: "🍅",
    targetKg: 15000,
    basePrice: 30,
    bulkPrice: 33.5,
    soloFreight: 2,
    pooledFreight: 1.2,
    contractStatus: "Open for pooling",
    members: [
      { id: "M1", name: "Farmer A · Ramesh Patil", village: "Dindori", crop: "Tomato", grade: "Grade A", quantity: 5000 },
      { id: "M2", name: "Farmer B · Sunita Jadhav", village: "Vani", crop: "Tomato", grade: "Grade A", quantity: 3000 },
      { id: "M3", name: "Farmer C · Kailas More", village: "Ozar", crop: "Tomato", grade: "Grade B", quantity: 7000 },
      { id: "M4", name: "Farmer D · Anita Wagh", village: "Pimpalgaon", crop: "Tomato", grade: "Grade A", quantity: 2500 },
    ],
    bids: [
      { id: "B1", buyer: "Sahyadri Foods", pricePerKg: 33.5, minQuantity: 12000, terms: "50% advance · balance in 3 days", status: "Negotiating" },
      { id: "B2", buyer: "Mumbai Fresh Co.", pricePerKg: 34.2, minQuantity: 15000, terms: "Payment on delivery", status: "Open" },
      { id: "B3", buyer: "GreenLeaf Exports", pricePerKg: 35, minQuantity: 18000, terms: "Net 15 days", status: "Open" },
    ],
    payouts: [
      { member: "Farmer A · Ramesh Patil", quantity: 5000, amount: 167500, status: "Scheduled" },
      { member: "Farmer B · Sunita Jadhav", quantity: 3000, amount: 100500, status: "Scheduled" },
      { member: "Farmer C · Kailas More", quantity: 7000, amount: 224000, status: "Scheduled" },
      { member: "Farmer D · Anita Wagh", quantity: 2500, amount: 83750, status: "Paid" },
    ],
  },
  {
    id: "POOL-ONI-02",
    crop: "Onion",
    emoji: "🧅",
    targetKg: 30000,
    basePrice: 18,
    bulkPrice: 20.4,
    soloFreight: 2.6,
    pooledFreight: 1.5,
    contractStatus: "Contract signed",
    members: [
      { id: "M5", name: "Farmer E · Dnyaneshwar Shinde", village: "Lasalgaon", crop: "Onion", grade: "Grade B", quantity: 12000 },
      { id: "M6", name: "Farmer F · Vaishali Gaikwad", village: "Chandwad", crop: "Onion", grade: "Grade A", quantity: 9000 },
      { id: "M7", name: "Farmer G · Bhausaheb Kale", village: "Yeola", crop: "Onion", grade: "Grade B", quantity: 9500 },
    ],
    bids: [
      { id: "B4", buyer: "Annapurna Retail", pricePerKg: 20.4, minQuantity: 25000, terms: "Net 7 days", status: "Accepted" },
      { id: "B5", buyer: "AgroPure Processing", pricePerKg: 19.8, minQuantity: 20000, terms: "Net 10 days", status: "Open" },
    ],
    payouts: [
      { member: "Farmer E · Dnyaneshwar Shinde", quantity: 12000, amount: 244800, status: "Paid" },
      { member: "Farmer F · Vaishali Gaikwad", quantity: 9000, amount: 183600, status: "Paid" },
      { member: "Farmer G · Bhausaheb Kale", quantity: 9500, amount: 193800, status: "Scheduled" },
    ],
  },
];

export const TICKER: TickerQuote[] = [
  { crop: "Tomato", mandi: "Nashik APMC", price: 28, change: 3.2 },
  { crop: "Onion", mandi: "Lasalgaon APMC", price: 18.4, change: 1.4 },
  { crop: "Soybean", mandi: "Latur APMC", price: 46, change: -1.1 },
  { crop: "Pomegranate", mandi: "Sangola", price: 92, change: 4.6 },
  { crop: "Tomato", mandi: "Mumbai Vashi", price: 34, change: 6.1 },
  { crop: "Chilli", mandi: "Guntur", price: 118, change: -0.8 },
  { crop: "Grapes", mandi: "Pimpalgaon", price: 62, change: 2.3 },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Ramesh Patil",
    place: "Dindori, Nashik",
    crop: "Tomato",
    quote:
      "The mandi 168 km away showed the best price. AgriSense showed me the freight and I sold 22 km away instead.",
    gain: "+₹4/kg net",
  },
  {
    name: "Sunita Jadhav",
    place: "Vani, Nashik",
    crop: "Onion",
    quote:
      "Holding onion felt safe until the storage loss was shown against the forecast. I split the lot and slept better.",
    gain: "+₹1.8/kg net",
  },
  {
    name: "Dnyaneshwar Shinde",
    place: "Lasalgaon, Nashik",
    crop: "Onion",
    quote:
      "Our FPO pooled 30 tonnes in one week. Bulk tier price plus a shared truck changed the whole season.",
    gain: "+₹2.4/kg net",
  },
  {
    name: "Bhagyashri Kadam",
    place: "Sangola, Solapur",
    crop: "Pomegranate",
    quote:
      "Reliability scores stopped a payment dispute before it started. I now check the score before loading.",
    gain: "0 payment delays",
  },
];

export const FAQS: Faq[] = [
  {
    q: "How is net realization calculated?",
    a: "We take the buyer or mandi headline price and subtract road freight for your exact distance, storage or holding cost and expected grading loss. What remains is what reaches your hand.",
  },
  {
    q: "Where do the mandi prices come from?",
    a: "This prototype runs on demo data modelled on APMC arrival and price patterns for Maharashtra, Karnataka and Andhra Pradesh belts.",
  },
  {
    q: "What does the reliability score mean?",
    a: "It is built from a buyer's completed transactions, on-time payment ratio and open disputes. A high price from a low-reliability buyer is ranked down.",
  },
  {
    q: "Can an FPO use one account for many farmers?",
    a: "Yes. The FPO workspace pools member lots into a single aggregated consignment, unlocking bulk tier prices and lower per-kg freight.",
  },
  {
    q: "Does AgriSense charge a commission on my sale?",
    a: "No commission on the produce value. The demo shows freight and settlement costs only.",
  },
];

export const TRUST_METRICS = [
  { label: "Verified buyers", value: "412", hint: "KYC and GST checked" },
  { label: "Settlements tracked", value: "₹18.4 Cr", hint: "Across 2026" },
  { label: "On-time payments", value: "98%", hint: "Last 12 months" },
  { label: "Data encrypted", value: "AES-256", hint: "At rest and in transit" },
];
