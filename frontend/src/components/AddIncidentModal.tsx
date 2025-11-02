// src/components/AddIncidentModal.tsx

import AddIncidentForm from "./AddIncidentForm";

type Props = {
  tutorId: string;
  onClose: () => void;
};

export default function AddIncidentModal({ tutorId, onClose }: Props) {
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
            <h2 className="text-xl font-bold">Add new Incident</h2>
            <button
              onClick={() => onClose()}
              className="text-gray-600 hover:text-gray-900 text-2xl"
            >
              &times;
            </button>
          </div>
          <AddIncidentForm tutorId={tutorId} onSuccess={onClose} />
        </div>
      </div>
    </>
  );
}
