// src/components/Dashboard

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import AddTutorModal from "./AddTutorModal";
import TutorItem from "./TutorItem";
import { getAuth, signOut } from "firebase/auth";

type Tutor = {
  tutorId: string;
  tutorName: string;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <ul className="border grid grid-cols-2 lg:grid-cols-4">
        {tutors.map((tutor, index) => (
          <TutorItem
            key={index}
            tutorId={tutor.tutorId}
            tutorName={tutor.tutorName}
          />
        ))}
        <li
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col items-center"
        >
          <p className="border h-24 w-24 flex items-center justify-center rounded-sm overflow-hidden bg-gray-400">
            +
          </p>
        </li>
      </ul>
      {tutors.length === 0 && <p>you have no tutors yet</p>}
      {/* conditionally render the modal */}
      {isModalOpen && <AddTutorModal onClose={() => setIsModalOpen(false)} />}
      <button onClick={handleSignout} className="bg-red-300 p-2 cursor-pointer">
        log out ?
      </button>
    </div>
  );
}
