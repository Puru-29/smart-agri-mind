import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, Volume2, VolumeX } from "lucide-react";
import { PortalLayout } from "@/components/agri/portal-layout";
import { PageHeader, Panel, Pill } from "@/components/agri/ui-bits";
import { BOT_ANSWERS, BOT_GREETING, askAgriBot } from "@/services";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/agribot")({
  head: () => ({
    meta: [
      { title: "AgriBot — AI Farm & Market Assistant | AgriSense" },
      {
        name: "description",
        content:
          "Ask AgriBot in Marathi, Hindi or English about live APMC mandi rates, the best harvest sale window and AI grading.",
      },
      { property: "og:title", content: "AgriBot — AI Farm & Market Assistant" },
      {
        property: "og:description",
        content: "Your virtual Kisan assistant for mandi prices, selling windows and grading.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AgriBot,
});

type Msg = { role: "bot" | "user"; text: string };

const SPEECH_LOCALE = { en: "en-IN", hi: "hi-IN", mr: "mr-IN", gu: "gu-IN" } as const;

function AgriBot() {
  const { t, lang } = useI18n();
  const botLang = lang === "hi" ? "hi" : lang === "mr" ? "mr" : "en";
  const [messages, setMessages] = useState<Msg[]>([{ role: "bot", text: BOT_GREETING[botLang] }]);
  const [draft, setDraft] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ role: "bot", text: BOT_GREETING[botLang] }]);
  }, [botLang]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const ask = (question: string) => {
    const q = question.trim();
    if (!q) return;
    const reply = askAgriBot(q, botLang);
    setMessages((prev) => [...prev, { role: "user", text: q }, { role: "bot", text: reply }]);
    setDraft("");
  };

  const lastBot = [...messages].reverse().find((m) => m.role === "bot")?.text ?? "";

  const speak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(lastBot);
    utter.lang = SPEECH_LOCALE[lang] ?? "en-IN";
    utter.rate = 0.95;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    setSpeaking(true);
  };

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  return (
    <PortalLayout>
      <PageHeader
        eyebrow="AgriBot"
        title="AI Farm & Market Assistant"
        description="Ask in Marathi, Hindi or English about live APMC mandi rates, the best harvest sale dates, or how to get Grade A quality certificates."
        action={
          <Pill tone="green">
            <Sparkles className="h-3.5 w-3.5" /> {t("Marathi / Hindi / English")}
          </Pill>
        }
      />

      <Panel className="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Bot className="h-5 w-5" />
            </span>
            <div>
              <p className="font-medium">{t("AgriBot Virtual Kisan Assistant")}</p>
              <p className="text-xs text-muted-foreground">
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-primary align-middle" />
                {t("Online")} · Marathi / Hindi / English
              </p>
            </div>
          </div>
          <button
            onClick={speak}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm font-medium"
            aria-label={t("Read Response")}
          >
            {speaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            {speaking ? t("Stop reading") : t("Read Response")}
          </button>
        </div>

        <div className="max-h-[52vh] space-y-4 overflow-y-auto p-5">
          {messages.map((m, i) => (
            <div
              key={`${i}-${m.text.slice(0, 12)}`}
              className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-3xl rounded-br-lg bg-primary px-4 py-3 text-sm text-primary-foreground"
                    : "max-w-[85%] rounded-3xl rounded-bl-lg bg-secondary px-4 py-3 text-sm text-secondary-foreground"
                }
              >
                {m.role === "bot" ? (
                  <p className="mb-1 text-xs font-semibold text-muted-foreground">AgriBot</p>
                ) : null}
                <p className="leading-relaxed">{m.text}</p>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border p-5">
          <div className="flex flex-wrap gap-2">
            {BOT_ANSWERS.map((a) => (
              <button
                key={a.id}
                onClick={() => ask(a.chip)}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors hover:bg-secondary"
              >
                {a.chip}
              </button>
            ))}
          </div>

          <form
            className="mt-4 flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              ask(draft);
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t("Type question in Marathi, Hindi, or English...")}
              aria-label={t("Type question in Marathi, Hindi, or English...")}
              className="flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
            >
              <Send className="h-4 w-4" /> {t("Ask AgriBot")}
            </button>
          </form>
        </div>
      </Panel>
    </PortalLayout>
  );
}
