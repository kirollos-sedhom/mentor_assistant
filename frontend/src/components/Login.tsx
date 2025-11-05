// src/components/Login.tsx

import { useState } from "react";
import { signInWithGoogle } from "../services/auth";
import { createMentorIfNotExists } from "../services/mentorService";

import MySwitch from "./SHADCN/MySwitch";

import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  let navigate = useNavigate();
  async function handleLogin() {
    setLoading(true);
    setError(null);

    try {
      const user = await signInWithGoogle();
      console.log("wellcome: ", user.displayName);
      console.log("your id is: ", user.uid);
      createMentorIfNotExists(user);
      navigate("/");
    } catch (error) {
      if (error instanceof Error) setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="h-screen flex justify-center">
      <div className="form m-4 flex flex-col items-center gap-4  w-8/10">
        <h1 className="font-semibold text-xl my-5">
          Welcome to the Mentor assistant
        </h1>

        <div className="inputs  gap-2  flex flex-col w-full">
          <input
            className="bg-gray-100 px-4 py-2 border border-gray-200 mb-2"
            type="text"
            placeholder="Email or phone number"
          />
          <input
            className="bg-gray-100 px-4 py-2 border border-gray-200"
            type="password"
            placeholder="Enter password"
          />
          <div className="flex place-content-between">
            <MySwitch />
            <NavLink to={"/reset-password"} className={"text-sm text-blue-500"}>
              Forgot password?
            </NavLink>
          </div>
        </div>
        <Button className="bg-blue-500 w-full mt-4">Sign in</Button>

        <Button onClick={handleLogin} className="w-full mt-4">
          <FcGoogle />
          {loading ? "signing in..." : "continue with google"}
        </Button>
      </div>
    </div>
  );
}
