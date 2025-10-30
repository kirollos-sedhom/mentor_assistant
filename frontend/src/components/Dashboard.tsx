// src/components/Dashboard

import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";

export default function Dashboard() {
  const auth = getAuth();
  return (
    <div>
      Dashboard
      <h1>wellcome {auth.currentUser?.displayName}</h1>
    </div>
  );
}
