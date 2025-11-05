// src/components/TutorItem.tsx

import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import UpdateTutorModal from "./UpdateTutorModal";
import { deleteTutor } from "../services/tutorService";
import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import { GrUserManager } from "react-icons/gr";
import { MdOutlineFace } from "react-icons/md";
import { TbFaceId } from "react-icons/tb";
import { cn, getDeterministicColor } from "@/lib/utils";

type Props = {
  tutorName: string;
  tutorId: string;
};
export default function TutorItem({ tutorName, tutorId }: Props) {
  const [showEditModal, setShowEditModal] = useState(false);
  const displayText = `[T-${tutorId}] ${tutorName}`;
  const color = getDeterministicColor(tutorId);

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
    <li key={tutorId} className="flex flex-col items-center">
      <p className="border h-24 w-24 flex items-center justify-center rounded-sm overflow-hidden">
        {/* employee icon here, different color depending on the index */}
        {/* example: first employee icon yellow, second is blue, third is green , etc */}
        <TbFaceId size={100} className={cn("bg-red-400 text-white", color)} />
      </p>
      <p>{displayText}</p>
    </li>
  );
}
