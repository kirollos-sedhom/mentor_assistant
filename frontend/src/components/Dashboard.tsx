// src/components/Dashboard

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import AddTutorModal from "./AddTutorModal";
import TutorItem from "./TutorItem";

type Tutor = {
  tutorId: string;
  tutorName: string;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    //todo: set up onSnapshot listener here
    const tutorsRef = collection(db, "mentors", user.uid, "tutors");
    const unsubscribe = onSnapshot(tutorsRef, (snapshot) => {
      const tutorsList = snapshot.docs.map((doc) => ({
        ...(doc.data() as Tutor),
      }));
      console.log(tutorsList);
      setTutors(tutorsList);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) return <div>please log in first</div>;

  return (
    <div>
      Dashboard
      <h1>wellcome {user?.displayName}</h1>
      <h2>your tutors:</h2>
      <ul>
        {tutors.map((tutor, index) => (
          <TutorItem
            key={index}
            tutorId={tutor.tutorId}
            tutorName={tutor.tutorName}
          />
        ))}
      </ul>
      {tutors.length === 0 && <p>you have no tutors yet</p>}
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700"
      >
        add tutor
      </button>
      {/* conditionally render the modal */}
      {isModalOpen && <AddTutorModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
