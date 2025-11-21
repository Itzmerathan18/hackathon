import { Mic, MicOff } from "lucide-react";
import { useCallback } from "react";
import { useVoiceInput } from "../hooks/useVoiceInput.js";

export default function VoiceInputButton({ onTranscript }) {
  const handleResult = useCallback(
    (text) => {
      if (onTranscript) onTranscript(text);
    },
    [onTranscript]
  );

  const { listening, available, start } = useVoiceInput(handleResult);

  if (!available) return null;

  return (
    <button
      type="button"
      onClick={start}
      className={`p-2 rounded-2xl border ${
        listening ? "border-red-400 bg-red-50 text-red-600" : "border-emerald-200 bg-white text-emerald-700"
      } flex items-center gap-1 text-sm`}
    >
      {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      {listening ? "Listening..." : "Speak"}
    </button>
  );
}

