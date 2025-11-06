// src/components/Dashboard

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import AddTutorModal from "./AddTutorModal";
import TutorItem from "./TutorItem";
import { getAuth, signOut } from "firebase/auth";
import { FaPlus } from "react-icons/fa";

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
    <div className="dashboard text-center">
      <h1 className="text-xl font-semibold mt-4">
        Wellcome {user?.displayName}
      </h1>
      {tutors.length > 0 ? (
        <h2 className="my-4 text-lg">choose a tutor</h2>
      ) : (
        <h2>you don't have a tutor yet</h2>
      )}
      <ul className="grid grid-cols-2 lg:grid-cols-4 gap-8">
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
            <FaPlus size={28} />
          </p>
        </li>
      </ul>

      {/* conditionally render the modal */}
      {isModalOpen && <AddTutorModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
