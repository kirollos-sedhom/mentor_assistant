// src/services/tutorService.ts

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
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
  await updateDoc(tutorRef, updatedFields);
}
