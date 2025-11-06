// src/App.tsx

import { onAuthStateChanged, type User } from "firebase/auth";
import "./App.css";
import Login from "./components/Login";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import { useAuth } from "./context/AuthContext";
import TutorPage from "./pages/TutorPage";
import Home from "./pages/Home";
import Layout from "./components/Layout";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <h1>loading...</h1>;
  }
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tutors/:tutorId"
          element={
            <ProtectedRoute user={user}>
              <TutorPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
