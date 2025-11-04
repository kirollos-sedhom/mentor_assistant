// src/pages/TutorPage.tsx

import { collection, onSnapshot, type Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import AddIncidentModal from "../components/AddIncidentModal";

type Incident = {
  description?: string;
  date?: Timestamp;
};
export default function TutorPage() {
  const { user } = useAuth();
  const { tutorId } = useParams();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [showIncidentsModal, setShowIncidentsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");

  // GenAI
  async function getSummary(tutorId: string) {
    if (!user) return;

    try {
      setLoading(true);
      // 1. Get the user's ID token from Firebase Auth
      const token = await user.getIdToken();

      // 2. Call your backend endpoint
      const response = await fetch(
        `http://localhost:3000/summary/${user.uid}/${tutorId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch summary");
      }

      const data = await response.json();

      console.log("AI Summary:", data.summary);
      setSummary(data.summary);
      // Now you can set this summary to your React state!
    } catch (error) {
      console.error("Error getting summary:", error);
    } finally {
      setLoading(false);
    }
  }
  //

  useEffect(() => {
    if (!user || !tutorId) return;
    const incidentsRef = collection(
      db,
      "mentors",
      user.uid,
      "tutors",
      tutorId,
      "incidents"
    );
    const unsubscribe = onSnapshot(incidentsRef, (snapshot) => {
      const incidentsList = snapshot.docs.map((doc) => ({
        ...(doc.data() as Incident),
      }));
      setIncidents(incidentsList);
    });

    return () => unsubscribe();
  }, [user, tutorId]);
  return (
    <div>
      <h1>TutorPage for tutor {tutorId}</h1>
      <h2>incidents:</h2>
      <ul>
        {incidents.map((incident, index) => (
          <li key={index}>
            <p>{incident.description}</p>{" "}
            <p>{incident.date?.toDate().toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
      <button
        onClick={() => setShowIncidentsModal(true)}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700"
      >
        add Incident
      </button>
      {tutorId && (
        <button
          onClick={() => getSummary(tutorId)}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-700"
        >
          get summary
        </button>
      )}

      {loading && <p>loading...</p>}
      {!loading && <p>{summary}</p>}

      {showIncidentsModal && tutorId && (
        <AddIncidentModal
          tutorId={tutorId}
          onClose={() => setShowIncidentsModal(false)}
        />
      )}
    </div>
  );
}
