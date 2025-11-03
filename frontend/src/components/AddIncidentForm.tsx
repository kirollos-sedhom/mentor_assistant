// src/components/AddIncidentForm.tsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { addIncident } from "../services/tutorService";

type Props = {
  tutorId: string;
  onSuccess?: () => void;
};

export default function AddIncidentForm({ tutorId, onSuccess }: Props) {
  const { user } = useAuth();

  const [incidentDescription, setIncidentDescription] = useState<string>("");
  const [incidentDate, setIncidentDate] = useState("");
  const [incidentTime, setIncidentTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAddIncident(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const combinedDateTime = new Date(`${incidentDate}T${incidentTime}`);

      await addIncident(
        user.uid,
        tutorId.trim(),
        incidentDescription,
        combinedDateTime
      );

      setIncidentDescription("");
      onSuccess?.();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={handleAddIncident} className="flex flex-col gap-2 w-80">
      <textarea
        className="border p-2 rounded"
        placeholder="incident"
        rows={4}
        value={incidentDescription}
        required
        onChange={(e) => setIncidentDescription(e.target.value)}
      />
      <div className="flex gap-2">
        <input
          type="date"
          className="border p-2 rounded w-1/2"
          value={incidentDate}
          onChange={(e) => setIncidentDate(e.target.value)}
          required
        />
        <input
          type="time"
          className="border p-2 rounded w-1/2"
          value={incidentTime}
          onChange={(e) => setIncidentTime(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white p-2 rounded cursor-pointer hover:bg-blue-700"
      >
        {loading ? "remembering..." : "record incident?"}
      </button>

      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
