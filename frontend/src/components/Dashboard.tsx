// src/components/Dashboard

import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import { useEffect, useState } from "react";
// import { getTutors } from "../services/mentorService";
import { addTutor } from "../services/tutorService";
import { useAuth } from "../context/AuthContext";

type Tutor = {
  tutorId: string;
  tutorName: string;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [tutors, setTutors] = useState<Tutor[]>([]);

  useEffect(() => {
    if (!user) return;
    //todo: set up onSnapshot listener here
  }, [user]);

  function handleAddTutor() {
    if (user) addTutor(user?.uid, "1", "hossam");
  }

  return (
    <div>
      Dashboard
      <h1>wellcome {user?.displayName}</h1>
      <button
        onClick={handleAddTutor}
        className="bg-blue-300 px-2 py-1 cursor-pointer active:bg-blue-400"
      >
        add tutor?
      </button>
    </div>
  );
}
