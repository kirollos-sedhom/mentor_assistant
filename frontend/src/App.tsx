// src/App.tsx

import "./App.css";
import Login from "./components/Login";
import { signInWithGoogle } from "./services/auth";

function App() {
  function handleLogin() {
    signInWithGoogle();
  }
  return (
    <>
      <div className="bg-red-300">mentor assistant who are you?</div>

      <Login />
    </>
  );
}

export default App;
