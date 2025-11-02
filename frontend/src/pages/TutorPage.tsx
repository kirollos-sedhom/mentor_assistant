// src/pages/TutorPage.tsx

import { collection, onSnapshot, type Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";

type Incident = {
  description?: string;
  date?: Timestamp;
};
export default function TutorPage() {
  const { user } = useAuth();
  const { tutorId } = useParams();
  const [incidents, setIncidents] = useState<Incident[]>([]);

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
          <li key={index}>{incident.description}</li>
        ))}
      </ul>
    </div>
  );
}
