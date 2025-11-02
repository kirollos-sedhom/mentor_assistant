// src/components/AddTutorModal.tsx

import AddTutorForm from "./AddTutorForm";

type Props = {
  onClose: () => void;
};

export default function AddTutorModal({ onClose }: Props) {
  return (
    <>
      <div
        onClick={() => onClose()}
        className="fixed onset-0 bg-black bg-opacity-50 flex jusitfy-center items-center z-50"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white p-6 rounded-lg shadow-xl"
        >
          {/* modal header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Add new Tutor</h2>
            <button
              onClick={() => onClose()}
              className="text-gray-600 hover:text-gray-900 text-2xl"
            >
              x
            </button>
          </div>
          <AddTutorForm onSuccess={onClose} />
        </div>
      </div>
    </>
  );
}
