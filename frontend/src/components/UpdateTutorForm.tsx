// src/components/UpdateTutorForm.tsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateTutor } from "../services/tutorService";

type Props = {
  onSuccess?: () => void;
  tutorId: string;
};

export default function UpdateTutorForm({ onSuccess, tutorId }: Props) {
  const { user } = useAuth();
  const [tutorName, setTutorName] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpdateTutor(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await updateTutor(user.uid, tutorId.trim(), {
        tutorName: tutorName.trim(),
      });

      setTutorName("");
      onSuccess?.();
    } catch (error) {
      if (error instanceof Error)
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={handleUpdateTutor} className="flex flex-col gap-2 w-80">
      <input
        className="border p-2 rounded bg-gray-200 text-gray-400"
        type="text"
        placeholder="tutor ID"
        value={tutorId}
        disabled
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
        {loading ? "updating..." : "update tutor?"}
      </button>

      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
