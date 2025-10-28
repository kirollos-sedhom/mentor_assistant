import React, { useState } from "react";
import { signInWithGoogle } from "../services/auth";

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
    } catch (error) {
      if (error instanceof Error) setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xl">Mentor-Assistant</p>
      <h1>Let's get started</h1>
      <p>signup for the family and get started immediately</p>
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
