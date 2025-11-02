// src/services/tutorService.ts

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export async function addTutor(
  mentorId: string,
  tutorId: string,
  tutorName: string
) {
  const tutorRef = doc(db, "mentors", mentorId, "tutors", tutorId);
  const tutorSnap = await getDoc(tutorRef);
  if (!tutorSnap.exists()) {
    await setDoc(tutorRef, {
      tutorId: tutorId,
      tutorName: tutorName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else {
    throw new Error("tutor already exists");
  }
}

export async function updateTutor(
  mentorId: string,
  tutorId: string,
  updatedFields: Partial<{ tutorName: string }>
) {
  const tutorRef = doc(db, "mentors", mentorId, "tutors", tutorId);
  await updateDoc(tutorRef, { ...updatedFields, updatedAt: serverTimestamp() });
}

export async function deleteTutor(mentorId: string, tutorId: string) {
  const tutorRef = doc(db, "mentors", mentorId, "tutors", tutorId);
  await deleteDoc(tutorRef);
}

export async function addIncident(
  mentorId: string,
  tutorId: string,
  incidentDescription: string,
  incidentDate = serverTimestamp()
) {
  const incidentsRef = collection(
    db,
    "mentors",
    mentorId,
    "tutors",
    tutorId,
    "incidents"
  );

  await addDoc(incidentsRef, {
    description: incidentDescription,
    date: serverTimestamp(),
  });
}
