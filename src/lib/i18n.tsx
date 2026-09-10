import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type LangCode = "en" | "hi" | "mr" | "gu";

export const LANGUAGES: { code: LangCode; native: string; label: string }[] = [
  { code: "en", native: "English", label: "English" },
  { code: "hi", native: "हिन्दी", label: "Hindi" },
  { code: "mr", native: "मराठी", label: "Marathi" },
  { code: "gu", native: "ગુજરાતી", label: "Gujarati" },
];

/**
 * Dictionaries are keyed by the English source string. Any string that has no
 * entry simply falls back to English, so partial translations stay safe.
 */
type Dict = Record<string, string>;

const hi: Dict = {
  // Navigation
  Dashboard: "डैशबोर्ड",
  "My Crops": "मेरी फसलें",
  Markets: "मंडियां",
  "AI Decision": "एआई निर्णय",
  "AI Insights": "एआई निर्णय",
  "Price Forecast": "भाव अनुमान",
  Buyers: "खरीदार",
  Orders: "ऑर्डर",
  Logistics: "लॉजिस्टिक्स",
  Settlements: "भुगतान",
  Payments: "भुगतान",
  FPO: "एफपीओ",
  Notifications: "सूचनाएं",
  Profile: "प्रोफ़ाइल",
  "Farm location": "खेत का स्थान",
  "Farmer portal": "किसान पोर्टल",
  Language: "भाषा",
  "Choose language": "भाषा चुनें",

  // Crops
  Tomato: "टमाटर",
  Onion: "प्याज",
  Soybean: "सोयाबीन",
  Pomegranate: "अनार",

  // Statuses & actions
  "SELL NOW": "अभी बेचें",
  HOLD: "रोकें",
  SPLIT: "बांटकर बेचें",
  "Sell now": "अभी बेचें",
  Hold: "रोकें",
  "Add crop lot": "फसल जोड़ें",
  "Register lot": "फसल जोड़ें",
  "Compare markets": "बाजार की तुलना करें",
  "View decision": "निर्णय देखें",
  "Find buyers": "खरीदार खोजें",
  "View all": "सभी देखें",
  "All lots": "सभी फसलें",
  "View full breakdown": "पूरा विश्लेषण देखें",
  "Open portal": "पोर्टल खोलें",
  "Enter the portal": "पोर्टल में जाएं",
  "Sign in": "साइन इन",
  "Browse markets": "मंडियां देखें",
  "See a live decision": "लाइव निर्णय देखें",
  "See a full breakdown": "पूरा विश्लेषण देखें",
  "Mark all read": "सभी पढ़ा हुआ करें",

  // Dashboard
  "Namaste, Ramesh 🙏": "नमस्ते, रमेश 🙏",
  "AI market decision": "एआई बाजार निर्णय",
  "Offer price": "प्रस्ताव भाव",
  Transport: "परिवहन",
  "Net realization": "शुद्ध आमदनी",
  "Active lots": "सक्रिय फसलें",
  "Portfolio value": "कुल मूल्य",
  "Best mandi gain": "सर्वोत्तम मंडी लाभ",
  "Avg transport": "औसत परिवहन",
  "At current offers": "मौजूदा प्रस्तावों पर",
  "Your crop lots": "आपकी फसलें",
  "Market opportunities": "मंडी अवसर",
  "Buyer opportunities": "खरीदार अवसर",
  Quantity: "मात्रा",
  Price: "भाव",
  Distance: "दूरी",
  Offer: "प्रस्ताव",
  Freight: "भाड़ा",
  Net: "शुद्ध",
  Harvest: "कटाई",
  confidence: "विश्वास",

  // Page headers
  Portfolio: "फसल सूची",
  "My crops": "मेरी फसलें",
  "Market intelligence": "बाजार जानकारी",
  "Markets near you": "आपके पास की मंडियां",
  "Buyer directory": "खरीदार सूची",
  "Buyers near your farm": "आपके खेत के पास खरीदार",
  "Order tracking": "ऑर्डर ट्रैकिंग",
  Alerts: "अलर्ट",
  Account: "खाता",
  "FPO workspace": "एफपीओ कार्यक्षेत्र",

  // Landing
  "Built for Indian mandis": "भारतीय मंडियों के लिए बनाया गया",
  "Know the price.": "भाव जानें।",
  "Know the buyer.": "खरीदार जानें।",
  "Know when to sell.": "बेचने का सही समय जानें।",
  "AgriSense reads mandi arrivals, buyer demand, transport cost and payment reliability, then tells you exactly what to do with each crop lot — sell now, hold, or split.":
    "एग्रीसेंस मंडी आवक, खरीदार की मांग, परिवहन लागत और भुगतान भरोसे को पढ़कर बताता है कि हर फसल का क्या करें — अभी बेचें, रोकें या बांटकर बेचें।",
  "Higher net realization": "अधिक शुद्ध आमदनी",
  "Signals per decision": "प्रति निर्णय संकेत",
  "Verified buyers": "सत्यापित खरीदार",
  "Today's decision": "आज का निर्णय",
  "The gap": "कमी",
  "Decision engine": "निर्णय इंजन",
  "Buyer trust": "खरीदार भरोसा",
  "Market information alone isn't enough": "सिर्फ बाजार की जानकारी काफी नहीं है",
  "AI decision engine": "एआई निर्णय इंजन",
  "Six weighted signals, one recommendation": "छह संकेत, एक सिफारिश",
  "Everything priced from your farm gate": "सब कुछ आपके खेत से आंका गया",
  "How it works": "यह कैसे काम करता है",
  "Three steps to a better price": "बेहतर भाव के तीन कदम",
  "Reliability is a number, not a rumour": "भरोसा अफवाह नहीं, आंकड़ा है",
  "Your next harvest deserves a better decision":
    "आपकी अगली फसल बेहतर निर्णय की हकदार है",
  "Market intelligence for farmers, FPOs and buyers.":
    "किसानों, एफपीओ और खरीदारों के लिए बाजार जानकारी।",

  // Auth
  "Welcome back": "फिर से स्वागत है",
  "Choose your role and sign in with the phone number registered with your mandi.":
    "अपनी भूमिका चुनें और मंडी में दर्ज मोबाइल नंबर से साइन इन करें।",
  Farmer: "किसान",
  Buyer: "खरीदार",
  Admin: "प्रशासक",
  "Sell your crop lots": "अपनी फसल बेचें",
  "Source verified produce": "सत्यापित उपज खरीदें",
  "Aggregate member lots": "सदस्यों की फसल जोड़ें",
  "Manage the network": "नेटवर्क संभालें",
  "Phone number": "मोबाइल नंबर",
  "4-digit PIN": "4 अंकों का पिन",
  "Continue as demo farmer (Ramesh)": "डेमो किसान (रमेश) के रूप में जारी रखें",
};

const mr: Dict = {
  Dashboard: "डॅशबोर्ड",
  "My Crops": "माझी पिके",
  Markets: "बाजारभाव",
  "AI Decision": "एआय निर्णय",
  "AI Insights": "एआय निर्णय",
  "Price Forecast": "दर अंदाज",
  Buyers: "खरेदीदार",
  Orders: "ऑर्डर",
  Logistics: "वाहतूक",
  Settlements: "पेमेंट्स",
  Payments: "पेमेंट्स",
  FPO: "शेतकरी उत्पादक संस्था (FPO)",
  Notifications: "सूचना",
  Profile: "प्रोफाइल",
  "Farm location": "शेताचे ठिकाण",
  "Farmer portal": "शेतकरी पोर्टल",
  Language: "भाषा",
  "Choose language": "भाषा निवडा",

  Tomato: "टोमॅटो",
  Onion: "कांदा",
  Soybean: "सोयाबीन",
  Pomegranate: "डाळिंब",

  "SELL NOW": "आत्ताच विका",
  HOLD: "थांबवा",
  SPLIT: "विभागून विका",
  "Sell now": "आत्ताच विका",
  Hold: "थांबवा",
  "Add crop lot": "पीक जोडा",
  "Register lot": "पीक जोडा",
  "Compare markets": "बाजार तुलना करा",
  "View decision": "निर्णय पहा",
  "Find buyers": "खरेदीदार शोधा",
  "View all": "सर्व पहा",
  "All lots": "सर्व पिके",
  "View full breakdown": "संपूर्ण विश्लेषण पहा",
  "Open portal": "पोर्टल उघडा",
  "Enter the portal": "पोर्टलमध्ये जा",
  "Sign in": "साइन इन",
  "Browse markets": "बाजार पहा",
  "See a live decision": "थेट निर्णय पहा",
  "See a full breakdown": "संपूर्ण विश्लेषण पहा",
  "Mark all read": "सर्व वाचले म्हणून खूण करा",

  "Namaste, Ramesh 🙏": "नमस्कार, रमेश 🙏",
  "AI market decision": "एआय बाजार निर्णय",
  "Offer price": "देऊ केलेला दर",
  Transport: "वाहतूक",
  "Net realization": "निव्वळ उत्पन्न",
  "Active lots": "सक्रिय पिके",
  "Portfolio value": "एकूण मूल्य",
  "Best mandi gain": "सर्वोत्तम बाजार फायदा",
  "Avg transport": "सरासरी वाहतूक",
  "At current offers": "सध्याच्या दरांनुसार",
  "Your crop lots": "तुमची पिके",
  "Market opportunities": "बाजार संधी",
  "Buyer opportunities": "खरेदीदार संधी",
  Quantity: "प्रमाण",
  Price: "दर",
  Distance: "अंतर",
  Offer: "दर",
  Freight: "वाहतूक खर्च",
  Net: "निव्वळ",
  Harvest: "काढणी",
  confidence: "विश्वास",

  Portfolio: "पिकांची यादी",
  "My crops": "माझी पिके",
  "Market intelligence": "बाजार माहिती",
  "Markets near you": "जवळचे बाजार",
  "Buyer directory": "खरेदीदार यादी",
  "Buyers near your farm": "शेताजवळील खरेदीदार",
  "Order tracking": "ऑर्डर मागोवा",
  Alerts: "सूचना",
  Account: "खाते",
  "FPO workspace": "एफपीओ कार्यक्षेत्र",

  "Built for Indian mandis": "भारतीय बाजारांसाठी",
  "Know the price.": "दर जाणा.",
  "Know the buyer.": "खरेदीदार जाणा.",
  "Know when to sell.": "विक्रीची योग्य वेळ जाणा.",
  "AgriSense reads mandi arrivals, buyer demand, transport cost and payment reliability, then tells you exactly what to do with each crop lot — sell now, hold, or split.":
    "अ‍ॅग्रीसेन्स बाजार आवक, खरेदीदारांची मागणी, वाहतूक खर्च आणि पेमेंट विश्वासार्हता पाहून सांगते की प्रत्येक पिकाचे काय करावे — आत्ताच विका, थांबवा किंवा विभागून विका.",
  "Higher net realization": "अधिक निव्वळ उत्पन्न",
  "Signals per decision": "प्रत्येक निर्णयामागील संकेत",
  "Verified buyers": "पडताळलेले खरेदीदार",
  "Today's decision": "आजचा निर्णय",
  "The gap": "तफावत",
  "Decision engine": "निर्णय इंजिन",
  "Buyer trust": "खरेदीदार विश्वास",
  "Market information alone isn't enough": "फक्त बाजार माहिती पुरेशी नाही",
  "AI decision engine": "एआय निर्णय इंजिन",
  "Six weighted signals, one recommendation": "सहा संकेत, एक शिफारस",
  "Everything priced from your farm gate": "सर्व दर तुमच्या शेतापासून",
  "How it works": "हे कसे चालते",
  "Three steps to a better price": "चांगल्या दरासाठी तीन पावले",
  "Reliability is a number, not a rumour": "विश्वास ही अफवा नाही, आकडा आहे",
  "Your next harvest deserves a better decision":
    "तुमच्या पुढील पिकाला चांगला निर्णय हवा",
  "Market intelligence for farmers, FPOs and buyers.":
    "शेतकरी, एफपीओ आणि खरेदीदारांसाठी बाजार माहिती.",

  "Welcome back": "पुन्हा स्वागत आहे",
  "Choose your role and sign in with the phone number registered with your mandi.":
    "तुमची भूमिका निवडा आणि बाजारात नोंदवलेल्या मोबाइल क्रमांकाने साइन इन करा.",
  Farmer: "शेतकरी",
  Buyer: "खरेदीदार",
  Admin: "प्रशासक",
  "Sell your crop lots": "तुमची पिके विका",
  "Source verified produce": "पडताळलेला माल खरेदी करा",
  "Aggregate member lots": "सदस्यांची पिके एकत्र करा",
  "Manage the network": "नेटवर्क सांभाळा",
  "Phone number": "मोबाइल क्रमांक",
  "4-digit PIN": "4 अंकी पिन",
  "Continue as demo farmer (Ramesh)": "डेमो शेतकरी (रमेश) म्हणून पुढे जा",
};

const gu: Dict = {
  Dashboard: "ડેશબોર્ડ",
  "My Crops": "મારા પાક",
  Markets: "બજાર",
  "AI Decision": "એઆઈ નિર્ણય",
  "AI Insights": "એઆઈ નિર્ણય",
  "Price Forecast": "ભાવ અનુમાન",
  Buyers: "ખરીદદારો",
  Orders: "ઓર્ડર",
  Logistics: "વાહનવ્યવહાર",
  Settlements: "ચુકવણી",
  Payments: "ચુકવણી",
  FPO: "એફપીઓ",
  Notifications: "સૂચનાઓ",
  Profile: "પ્રોફાઇલ",
  "Farm location": "ખેતરનું સ્થળ",
  "Farmer portal": "ખેડૂત પોર્ટલ",
  Language: "ભાષા",
  "Choose language": "ભાષા પસંદ કરો",

  Tomato: "ટામેટા",
  Onion: "ડુંગળી",
  Soybean: "સોયાબીન",
  Pomegranate: "દાડમ",

  "SELL NOW": "હમણાં વેચો",
  HOLD: "રોકો",
  SPLIT: "વહેંચીને વેચો",
  "Sell now": "હમણાં વેચો",
  Hold: "રોકો",
  "Add crop lot": "પાક ઉમેરો",
  "Register lot": "પાક ઉમેરો",
  "Compare markets": "બજારની સરખામણી કરો",
  "View decision": "નિર્ણય જુઓ",
  "Find buyers": "ખરીદદાર શોધો",
  "View all": "બધું જુઓ",
  "All lots": "બધા પાક",
  "View full breakdown": "સંપૂર્ણ વિશ્લેષણ જુઓ",
  "Open portal": "પોર્ટલ ખોલો",
  "Enter the portal": "પોર્ટલમાં જાઓ",
  "Sign in": "સાઇન ઇન",
  "Browse markets": "બજાર જુઓ",
  "See a live decision": "લાઇવ નિર્ણય જુઓ",
  "See a full breakdown": "સંપૂર્ણ વિશ્લેષણ જુઓ",
  "Mark all read": "બધું વાંચેલું ગણો",

  "Namaste, Ramesh 🙏": "નમસ્તે, રમેશ 🙏",
  "AI market decision": "એઆઈ બજાર નિર્ણય",
  "Offer price": "ઓફર ભાવ",
  Transport: "વાહનવ્યવહાર",
  "Net realization": "ચોખ્ખી આવક",
  "Active lots": "સક્રિય પાક",
  "Portfolio value": "કુલ મૂલ્ય",
  "Best mandi gain": "શ્રેષ્ઠ બજાર લાભ",
  "Avg transport": "સરેરાશ વાહનવ્યવહાર",
  "At current offers": "હાલના ભાવે",
  "Your crop lots": "તમારા પાક",
  "Market opportunities": "બજાર તકો",
  "Buyer opportunities": "ખરીદદાર તકો",
  Quantity: "જથ્થો",
  Price: "ભાવ",
  Distance: "અંતર",
  Offer: "ઓફર",
  Freight: "ભાડું",
  Net: "ચોખ્ખું",
  Harvest: "લણણી",
  confidence: "વિશ્વાસ",

  Portfolio: "પાક યાદી",
  "My crops": "મારા પાક",
  "Market intelligence": "બજાર માહિતી",
  "Markets near you": "તમારી નજીકના બજારો",
  "Buyer directory": "ખરીદદાર યાદી",
  "Buyers near your farm": "ખેતર નજીકના ખરીદદારો",
  "Order tracking": "ઓર્ડર ટ્રેકિંગ",
  Alerts: "ચેતવણીઓ",
  Account: "ખાતું",
  "FPO workspace": "એફપીઓ કાર્યસ્થળ",

  "Built for Indian mandis": "ભારતીય બજારો માટે",
  "Know the price.": "ભાવ જાણો.",
  "Know the buyer.": "ખરીદદાર જાણો.",
  "Know when to sell.": "વેચવાનો સમય જાણો.",
  "Higher net realization": "વધુ ચોખ્ખી આવક",
  "Signals per decision": "દરેક નિર્ણય પાછળના સંકેત",
  "Verified buyers": "ચકાસાયેલા ખરીદદારો",
  "Today's decision": "આજનો નિર્ણય",
  "The gap": "તફાવત",
  "Decision engine": "નિર્ણય એન્જિન",
  "Buyer trust": "ખરીદદાર વિશ્વાસ",
  "Market information alone isn't enough": "માત્ર બજાર માહિતી પૂરતી નથી",
  "AI decision engine": "એઆઈ નિર્ણય એન્જિન",
  "Six weighted signals, one recommendation": "છ સંકેત, એક ભલામણ",
  "Everything priced from your farm gate": "બધું તમારા ખેતરથી ગણાયેલું",
  "How it works": "આ કેવી રીતે કામ કરે છે",
  "Three steps to a better price": "સારા ભાવ માટે ત્રણ પગલાં",
  "Reliability is a number, not a rumour": "વિશ્વાસ અફવા નહીં, આંકડો છે",
  "Your next harvest deserves a better decision":
    "તમારી આગામી લણણી સારા નિર્ણયને પાત્ર છે",
  "Market intelligence for farmers, FPOs and buyers.":
    "ખેડૂતો, એફપીઓ અને ખરીદદારો માટે બજાર માહિતી.",

  "Welcome back": "ફરી સ્વાગત છે",
  "Choose your role and sign in with the phone number registered with your mandi.":
    "તમારી ભૂમિકા પસંદ કરો અને બજારમાં નોંધાયેલા મોબાઇલ નંબરથી સાઇન ઇન કરો.",
  Farmer: "ખેડૂત",
  Buyer: "ખરીદદાર",
  Admin: "એડમિન",
  "Sell your crop lots": "તમારા પાક વેચો",
  "Source verified produce": "ચકાસાયેલ માલ ખરીદો",
  "Aggregate member lots": "સભ્યોના પાક એકત્ર કરો",
  "Manage the network": "નેટવર્ક સંભાળો",
  "Phone number": "મોબાઇલ નંબર",
  "4-digit PIN": "4 અંકનો પિન",
  "Continue as demo farmer (Ramesh)": "ડેમો ખેડૂત (રમેશ) તરીકે આગળ વધો",
};

const DICTS: Record<LangCode, Dict> = { en: {}, hi, mr, gu };

const STORAGE_KEY = "agrisense-language";

type Ctx = {
  lang: LangCode;
  setLang: (code: LangCode) => void;
  t: (text: string) => string;
};

const I18nContext = createContext<Ctx>({
  lang: "en",
  setLang: () => {},
  t: (text) => text,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as LangCode | null;
    if (saved && LANGUAGES.some((l) => l.code === saved)) setLangState(saved);
  }, []);

  const setLang = useCallback((code: LangCode) => {
    setLangState(code);
    localStorage.setItem(STORAGE_KEY, code);
  }, []);

  const t = useCallback((text: string) => DICTS[lang][text] ?? text, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
