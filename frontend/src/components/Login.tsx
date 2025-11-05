// src/components/Login.tsx

import { useState } from "react";
import { signInWithGoogle } from "../services/auth";
import { createMentorIfNotExists } from "../services/mentorService";
import ToggleInput from "./ToggleInput";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setLoading(true);
    setError(null);

    try {
      const user = await signInWithGoogle();
      console.log("wellcome: ", user.displayName);
      console.log("your id is: ", user.uid);
      createMentorIfNotExists(user);
    } catch (error) {
      if (error instanceof Error) setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="font-semibold text-xl">Welcome to the Mentor assistant</h1>
      <input
        className="bg-gray-100 px-4 py-2 border border-gray-200"
        type="text"
        placeholder="Email or phone number "
      />
      <input
        className="bg-gray-100 px-4 py-2 border border-gray-200"
        type="password"
        placeholder="Enter password"
      />

      <div className="below-inputs">
        <ToggleInput />
      </div>
      <p className="bg-blue-500 w-50 text-white px-4 py-2 cursor-pointer">
        continue with facebook
      </p>

      <p
        className="bg-pink-500 w-50 text-white px-4 py-2 cursor-pointer"
        onClick={handleLogin}
      >
        {loading ? "signing in..." : "continue with Google"}
      </p>
    </div>
  );
}
