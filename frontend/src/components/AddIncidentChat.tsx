import { useAuth } from "@/context/AuthContext";
import { addIncident } from "@/services/tutorService";
import React, { useState } from "react";
import { Button } from "./ui/button";

type Props = {
  tutorId: string;
};
export default function AddIncidentChat({ tutorId }: Props) {
  const { user } = useAuth();
  const [description, setDescription] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [incidentTime, setIncidentTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !description.trim() || !incidentDate || !incidentTime) {
      setError("please fill out all fields");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const combinedDateTime = new Date(`${incidentDate}T${incidentTime}`);
      await addIncident(
        user.uid,
        tutorId,
        description.trim(),
        combinedDateTime
      );
      setDescription("");
      setIncidentDate("");
      setIncidentTime("");
    } catch (error) {
      if(error instanceof Error)
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 p-4 border rounded-lg bh-white shadow-md"
    >
      <h3 className="font-semibold">Log a new Incident</h3>
      <textarea
        className="border p-2 rounded w-full"
        rows={3}
        placeholder="what happened"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      ></textarea>
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
      <Button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Incident"}
      </Button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}
