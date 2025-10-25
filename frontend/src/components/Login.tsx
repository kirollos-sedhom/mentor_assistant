import { useState } from "react";
import { signInWithGoogle } from "../services/auth";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await signInWithGoogle();
      console.log("Welcome,", user.displayName);
      // later: redirect to dashboard
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md text-center">
        <h1 className="text-2xl font-semibold mb-4">Mentor Portal</h1>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>

        {error && <p className="text-red-500 mt-3">{error}</p>}
      </div>
    </div>
  );
}
