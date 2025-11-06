// src/pages/TutorPage.tsx

import {
  collection,
  onSnapshot,
  type Timestamp,
  query, // 1. Import query
  orderBy, // 2. Import orderBy
  getDoc, // 3. Import getDoc
  doc, // 4. Import doc
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import AddIncidentModal from "../components/AddIncidentModal";
import Incident from "@/components/Incident";
import AiSummary from "@/components/AiSummary"; // 5. Import new component
import { Button } from "@/components/ui/button"; // 6. Import shadcn Button
import { FaPlus } from "react-icons/fa";

type Incident = {
  id: string; // 7. Add the ID
  description: string;
  date: Timestamp;
};

export default function TutorPage() {
  const { user } = useAuth();
  const { tutorId } = useParams();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [tutorName, setTutorName] = useState("");
  const [showIncidentsModal, setShowIncidentsModal] = useState(false);

  // 8. We moved summary/loading state into AiSummary.tsx

  useEffect(() => {
    if (!user || !tutorId) return;

    // 9. Get the tutor's name once
    getDoc(doc(db, "mentors", user.uid, "tutors", tutorId)).then((doc) => {
      if (doc.exists()) setTutorName(doc.data().tutorName);
    });

    // 10. Create a query to sort incidents (newest first)
    const incidentsRef = collection(
      db,
      "mentors",
      user.uid,
      "tutors",
      tutorId,
      "incidents"
    );
    const q = query(incidentsRef, orderBy("date", "desc")); // "desc" = descending

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const incidentsList = snapshot.docs.map((doc) => ({
        id: doc.id, // 11. Get the real doc ID
        ...(doc.data() as { description: string; date: Timestamp }),
      }));
      setIncidents(incidentsList);
    });

    return () => unsubscribe();
  }, [user, tutorId]);

  if (!tutorId) return <div>Tutor ID not found.</div>;

  // 12. This is the new layout
  return (
    <div className="min-h-screen bg-gray-100">
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-10 w-full bg-white shadow-sm border-b">
        <div className="max-w-3xl mx-auto p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">
            {tutorName || "Tutor Details"}
          </h1>
          <Button onClick={() => setShowIncidentsModal(true)}>
            <FaPlus className="mr-2" size={12} />
            Add Incident
          </Button>
        </div>
      </header>

      {/* --- FEED --- */}
      <main className="max-w-3xl mx-auto p-4 md:p-6 space-y-4">
        {/* The AI Summary is the first item */}
        <AiSummary tutorId={tutorId} />

        {/* The Incident List */}
        {incidents.length > 0 ? (
          incidents.map((incident) => (
            <Incident
              key={incident.id} // Use the real ID
              description={incident.description}
              date={incident.date}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 pt-8">
            <p>No incidents logged yet.</p>
          </div>
        )}
      </main>

      {/* The Modal is still used */}
      {showIncidentsModal && (
        <AddIncidentModal
          tutorId={tutorId}
          onClose={() => setShowIncidentsModal(false)}
        />
      )}
    </div>
  );
}
