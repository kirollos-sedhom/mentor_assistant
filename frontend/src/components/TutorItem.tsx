// src/components/TutorItem.tsx

import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import UpdateTutorModal from "./UpdateTutorModal";
import { deleteTutor } from "../services/tutorService";
import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
type Props = {
  tutorName: string;
  tutorId: string;
};
export default function TutorItem({ tutorName, tutorId }: Props) {
  const [showEditModal, setShowEditModal] = useState(false);
  const displayText = `[T-${tutorId}] ${tutorName}`;
  const { user } = useAuth();
  async function handleDelete() {
    if (!user) return;
    const confirmed = window.confirm(
      `are you sure you want to delete "${tutorName}"?`
    );
    if (!confirmed) return;

    try {
      await deleteTutor(user.uid, tutorId);
    } catch (error: any) {
      console.error("error deleting tutor:", error);
      alert("failed to delete tutor, try again.");
    }
  }
  function handleEdit() {
    setShowEditModal(true);
  }

  return (
    <li key={tutorId} className="flex items-center justify-between p-1 my-2">
      <NavLink
        to={`/tutors/${tutorId}`}
        className={"flex-grow text-blue-700 hover:underline "}
      >
        {displayText}
      </NavLink>
      <span className="flex items-center gap-2">
        <FaEdit
          onClick={() => handleEdit()}
          className="fill-blue-700 cursor-pointer"
        />{" "}
        <AiFillDelete
          onClick={() => handleDelete()}
          className="fill-red-700 cursor-pointer"
        />{" "}
      </span>
      {showEditModal && (
        <UpdateTutorModal
          tutorId={tutorId}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </li>
  );
}
