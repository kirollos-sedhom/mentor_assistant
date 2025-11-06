import { getAuth, signOut } from "firebase/auth";
import React from "react";
import { CiLogout } from "react-icons/ci";

export default function Header() {
  function handleSignout() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
        console.log("looks like youre trapped :c");
      });
  }
  return (
    <nav className="flex justify-between items-center shadow-sm">
      <img className="w-15" src="/logo.png" alt="logo" />

      <CiLogout onClick={handleSignout} className="mr-2" size={22} />
    </nav>
  );
}
