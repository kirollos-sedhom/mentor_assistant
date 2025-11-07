// src/App.tsx

import "./App.css";
import Login from "./components/Login";

import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

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
