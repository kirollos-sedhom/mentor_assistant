// src/components/Dashboard

import { useEffect, useRef, useState } from "react";

import { addTutor } from "../services/tutorService";
import { useAuth } from "../context/AuthContext";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

type Tutor = {
  tutorId: string;
  tutorName: string;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [tutorName, setTutorName] = useState<string>("");
  const [tutorId, setTutorId] = useState<string>("");
  const nameRef = useRef(null);
  const idRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    //todo: set up onSnapshot listener here
    const tutorsRef = collection(db, "mentors", user.uid, "tutors");
    const unsubscribe = onSnapshot(tutorsRef, (snapshot) => {
      const tutorsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Tutor),
      }));
      console.log(tutorsList);
      setTutors(tutorsList);
    });

    return () => unsubscribe();
  }, [user]);

  function handleAddTutor() {
    if (user) {
      try {
        addTutor(user?.uid, tutorId, tutorName);
      } catch (error) {
        console.log(error);
      }
    }
  }

  if (!user) return <div>please log in first</div>;

  return (
    <div>
      Dashboard
      <h1>wellcome {user?.displayName}</h1>
      <h2>your tutors:</h2>
      <ul>
        {tutors.map((tutor) => (
          <li key={tutor.tutorId}>{tutor.tutorName}</li>
        ))}
      </ul>
      <input
        className="border-1"
        ref={nameRef}
        type="text"
        placeholder="name"
        value={tutorName}
        onChange={(e) => setTutorName(e.target.value)}
      />
      <input
        className="border-1"
        ref={idRef}
        type="text"
        placeholder="id"
        value={tutorId}
        onChange={(e) => setTutorId(e.target.value)}
      />
      <button
        onClick={handleAddTutor}
        className="bg-blue-300 px-2 py-1 cursor-pointer active:bg-blue-400"
      >
        add tutor?
      </button>
    </div>
  );
}
