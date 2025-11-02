// src/components/AddIncidentForm.tsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { addIncident } from "../services/tutorService";
import { Timestamp } from "firebase/firestore";

type Props = {
  tutorId: string;
  onSuccess?: () => void;
};

export default function AddIncidentForm({ tutorId, onSuccess }: Props) {
  const { user } = useAuth();

  const [incidentDescription, setIncidentDescription] = useState<string>("");
  const [incidentTime, setIncidentTime] = useState<Timestamp | undefined>(
    undefined
  );
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
      await addIncident(
        user.uid,
        tutorId.trim(),
        incidentDescription,
        incidentTime
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
      <input
        className="border p-2 rounded"
        type="text"
        placeholder="incident"
        value={incidentDescription}
        required
        onChange={(e) => setIncidentDescription(e.target.value)}
      />

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
