// src/components/TutorItem.tsx

import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai"; // 1. Import delete icon
import UpdateTutorModal from "./UpdateTutorModal";
import { deleteTutor } from "../services/tutorService"; // 2. Import delete service
import { useAuth } from "../context/AuthContext"; // 3. Import useAuth
import { NavLink } from "react-router-dom";
import { TbFaceId } from "react-icons/tb";
import { cn, getDeterministicColor } from "@/lib/utils";

type Props = {
  tutorName: string;
  tutorId: string;
  isManageMode: boolean;
};

export default function TutorItem({ tutorName, tutorId, isManageMode }: Props) {
  const [showEditModal, setShowEditModal] = useState(false);
  const color = getDeterministicColor(tutorId);
  const { user } = useAuth(); // 4. Get user for delete logic
  const displayText = `[T-${tutorId}] ${tutorName}`;
  // Stop navigation when clicking "Edit"
  function handleEdit(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setShowEditModal(true);
  }

  // 5. Add the delete handler function
  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete "${tutorName}"?`
    );
    if (!confirmed) return;

    try {
      // No need to show a modal, just delete directly
      await deleteTutor(user.uid, tutorId);
      // The onSnapshot listener in Dashboard.tsx will
      // automatically remove this item from the UI.
    } catch (error: any) {
      console.error("Error deleting tutor:", error);
      alert("Failed to delete tutor, try again.");
    }
  }

  return (
    <>
      <li className="flex flex-col items-center gap-2">
        <div className="relative">
          <NavLink
            to={isManageMode ? "#" : `/tutors/${tutorId}`}
            className={cn(
              "flex h-24 w-24 items-center justify-center rounded-md overflow-hidden transition",
              !isManageMode && "cursor-pointer hover:scale-105",
              color
            )}
          >
            <TbFaceId size={100} className="text-white" />

            {/* 6. Update the "Manage" overlay */}
            {isManageMode && (
              <div className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/60">
                {/* Edit Icon */}
                <FaEdit
                  onClick={handleEdit}
                  size={32}
                  className="text-white opacity-70 hover:opacity-100"
                />
                {/* Delete Icon */}
                <AiFillDelete
                  onClick={handleDelete}
                  size={32}
                  className="absolute -top-4 -right-4 text-red-500  hover:opacity-70"
                />
              </div>
            )}
          </NavLink>
        </div>

        <p className="group-hover:text-white">{displayText}</p>
      </li>

      {/* Modal is still here for editing */}
      {showEditModal && (
        <UpdateTutorModal
          tutorId={tutorId}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}
