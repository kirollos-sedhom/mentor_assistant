// src/services/auth.ts

import { signInWithPopup } from "firebase/auth";
import { auth, GoogleProvider } from "../firebase";

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, GoogleProvider);
    const user = result.user;

    return user;
  } catch (error) {
    console.error("google sign in error: ", error);
    throw error;
  }
};
