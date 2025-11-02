// src/components/UpdateTutorModal.tsx

import UpdateTutorForm from "./UpdateTutorForm";

type Props = {
  onClose: () => void;
  tutorId: string;
};

export default function UpdateTutorModal({ onClose, tutorId }: Props) {
  return (
    <>
      <div
        onClick={() => onClose()}
        className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white p-6 rounded-lg shadow-xl"
        >
          {/* modal header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Update Tutor</h2>
            <button
              onClick={() => onClose()}
              className="text-gray-600 hover:text-gray-900 text-2xl"
            >
              &times;
            </button>
          </div>
          <UpdateTutorForm tutorId={tutorId} onSuccess={onClose} />
        </div>
      </div>
    </>
  );
}
