// src/components/AiSummary.tsx

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react"; // Import icons

// 1. Define the new type for our summary object
type SummaryData = {
  summary: string;
  patterns: string[];
  suggestions: string[];
};

export default function AiSummary({ tutorId }: { tutorId: string }) {
  const { user } = useAuth();
  // 2. State will hold the object or null
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function getSummary() {
    if (!user) return;
    setLoading(true);
    setSummaryData(null); // Clear old summary
    setError("");

    try {
      const token = await user.getIdToken();
      const response = await fetch(
        `https://mentor-assistant-backend.vercel.app/summary/${user.uid}/${tutorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to fetch summary");
      }

      // 3. The data is now our JSON object
      const data: SummaryData = await response.json();
      setSummaryData(data);
    } catch (err) {
      if (err instanceof Error)
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // 4. This is the new, beautifully formatted JSX
  if (summaryData) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-200">
        <h3 className="flex items-center gap-2 font-semibold text-blue-700">
          <Sparkles size={16} />
          AI-Generated Summary
        </h3>

        {/* The Summary */}
        <p className="mt-4 text-gray-700 text-sm">{summaryData.summary}</p>

        {/* The Patterns */}
        <h4 className="font-semibold mt-4">Key Patterns:</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 mt-2">
          {summaryData.patterns.map((pattern, i) => (
            <li key={i}>{pattern}</li>
          ))}
        </ul>

        {/* The Suggestions */}
        <h4 className="font-semibold mt-4">Suggestions:</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 mt-2">
          {summaryData.suggestions.map((suggestion, i) => (
            <li key={i}>{suggestion}</li>
          ))}
        </ul>

        <Button
          variant="link"
          size="sm"
          onClick={getSummary}
          className="p-0 mt-4"
        >
          {loading ? "Regenerating..." : "Regenerate"}
        </Button>
      </div>
    );
  }

  // 5. This is the default "button" state
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border flex flex-col items-center gap-2">
      <h3 className="font-semibold">Get an AI Summary</h3>
      <p className="text-sm text-gray-500 text-center">
        Generate a summary of all incidents to identify patterns.
      </p>
      <Button onClick={getSummary} disabled={loading} className="mt-2">
        {loading ? "Generating..." : "Get Summary"}
      </Button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
