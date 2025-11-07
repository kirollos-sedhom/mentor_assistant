// src/components/Dashboard

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import AddTutorModal from "./AddTutorModal";
import TutorItem from "./TutorItem";
import { FaPlus} from "react-icons/fa"; 
type Tutor = {
  tutorId: string;
  tutorName: string;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageMode, setIsManageMode] = useState(false);
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
    <div className="dashboard flex flex-col min-h-screen w-full items-center justify-center">
      <h1 className="text-4xl font-thin mb-12">Wellcome {user?.displayName}</h1>
      {tutors.length > 0 ? (
        <h2 className="my-4 text-lg">
          {isManageMode ? "edit a tutor" : "choose a tutor"}
        </h2>
      ) : (
        <h2>you don't have a tutor yet</h2>
      )}
      <ul className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {tutors.map((tutor, index) => (
          <TutorItem
            key={index}
            tutorId={tutor.tutorId}
            tutorName={tutor.tutorName}
            isManageMode={isManageMode}
          />
        ))}
        <li
          onClick={() => setIsModalOpen(true)}
          className="flex cursor-pointer flex-col items-center gap-2 transition "
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-md bg-gray-400 transition hover:scale-105 hover:border-gray-700 hover:text-white">
            <FaPlus size={40} />
          </div>
          <p>Add Tutor</p>
        </li>
      </ul>

      <button
        onClick={() => setIsManageMode(!isManageMode)}
        className="mt-16 bg-gray-400 rounded-md border border-gray-600 px-6 py-2 hover:border-black"
      >
        {isManageMode ? "Done" : "Manage Tutors"}
      </button>
      {/* conditionally render the modal */}
      {isModalOpen && <AddTutorModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
