import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchSensorReadings, fetchSoilTests, askExpert } from "../services/mockApi.js";
import { MessageCircle, Send, Sparkles } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function ExpertChatView() {
  const { t } = useLanguage();
  const { data: tests = [] } = useQuery({
    queryKey: ["soilTests"],
    queryFn: fetchSoilTests,
  });
  const { data: sensors = [] } = useQuery({
    queryKey: ["sensorReadings"],
    queryFn: fetchSensorReadings,
  });

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your agronomy specialist. Ask about fertilizers, irrigation, diseases, or crop planning — I automatically reference your soil data and live sensors.",
    },
  ]);
  const [provider, setProvider] = useState("OpenAI GPT-4o mini");
  const [apiKey, setApiKey] = useState("");

  const mutation = useMutation({
    mutationFn: askExpert,
    onSuccess: (response) => {
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    },
  });

  const latestTest = tests[0];
  const latestSensor = sensors[0];

  const handleSend = (event) => {
    event.preventDefault();
    if (!question.trim()) return;
    const userMessage = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    mutation.mutate({ question, test: latestTest, sensor: latestSensor, provider });
    setQuestion("");
  };

  const quickPrompts = [
    "What fertilizer should I use this week?",
    "How do I improve soil pH?",
    "Suggest crops for low zinc soil.",
  ];

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-800/60">LLM Copilot</p>
        <h1 className="text-3xl font-bold text-emerald-950">{t("nav.chat")}</h1>
        <p className="text-emerald-900/70">
          Context-aware agronomy assistant infused with soil test history, live sensor feeds, and multi-domain expertise.
        </p>
      </header>

      <div className="rounded-3xl border border-emerald-100 bg-white/90 p-4 flex flex-col gap-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-emerald-900">AI Provider</span>
            <select
              className="rounded-2xl border border-emerald-100 px-3 py-2"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
            >
              <option>OpenAI GPT-4o mini</option>
              <option>Gemini 1.5 Flash</option>
              <option>Claude Haiku</option>
            </select>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <span className="text-sm font-semibold text-emerald-900">API Key (stored locally)</span>
            <input
              type="password"
              className="rounded-2xl border border-emerald-100 px-3 py-2"
              placeholder="Enter provider key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <span className="text-xs text-emerald-800/70">
              Status: {apiKey ? "Connected ✅" : "Not Connected (demo mode)"}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-sm"
            onClick={() => setQuestion(prompt)}
          >
            {prompt}
          </button>
        ))}
        </div>
      </div>

      <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-inner h-[420px] overflow-y-auto space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm whitespace-pre-line ${
                message.role === "assistant"
                  ? "bg-emerald-50 text-emerald-900"
                  : "bg-gradient-to-r from-green-600 to-emerald-500 text-white"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <form className="rounded-3xl border border-emerald-100 bg-white/90 p-4 flex flex-col gap-3" onSubmit={handleSend}>
        <div className="flex items-center gap-2 text-xs text-emerald-900/70">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          Auto-context: latest soil test + latest sensor + internet augmentation.
        </div>
        <div className="flex gap-3">
          <input
            className="flex-1 rounded-2xl border border-emerald-100 px-4 py-3"
            placeholder="Ask anything about soil, crops, fertilizers, pests…"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button
            className="rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 text-white px-5 py-3 flex items-center gap-2 font-semibold"
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <MessageCircle className="w-5 h-5 animate-pulse" />
                Thinking…
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

