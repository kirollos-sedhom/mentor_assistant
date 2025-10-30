// src/components/ProtectedRoute

import type { User } from "firebase/auth";
import React from "react";
import { Navigate } from "react-router-dom";
type Props = {
  user: User | null;
  children: React.ReactNode;
};
export default function ProtectedRoute(props: Props) {
  if (!props.user) {
    return <Navigate to="/login" replace />;
  }
  return <>{props.children}</>;
}
