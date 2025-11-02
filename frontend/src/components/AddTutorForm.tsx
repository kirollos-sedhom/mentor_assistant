// src/components/AddTutorForm.tsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { addTutor } from "../services/tutorService";

type Props = {
  onSuccess?: () => void;
};

export default function AddTutorForm({ onSuccess }: Props) {
  const { user } = useAuth();
  const [tutorName, setTutorName] = useState<string>("");
  const [tutorId, setTutorId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAddTutor(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await addTutor(user.uid, tutorId.trim(), tutorName.trim());
      setTutorId("");
      setTutorName("");
      onSuccess?.();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <form
      onSubmit={handleAddTutor}
      className="border-1 bg-green-300 flex flex-col gap-2 w-80"
    >
      <h2>Add Tutor Form</h2>
      <input
        className="border p-2 rounded"
        type="text"
        placeholder="tutor ID"
        value={tutorId}
        required
        onChange={(e) => setTutorId(e.target.value)}
      />
      <input
        className="border p-2 rounded"
        type="text"
        placeholder="name"
        value={tutorName}
        required
        onChange={(e) => setTutorName(e.target.value)}
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white p-2 rounded cursor-pointer hover:bg-blue-700"
      >
        {loading ? "adding..." : "add tutor?"}
      </button>

      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
