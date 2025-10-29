// src/services/mentorService.ts

import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";

import { type User } from "firebase/auth";

export async function createMentorIfNotExists(user: User) {
  // typescript complaining because of no type
  const mentorRef = doc(db, "mentors", user.uid);
  const mentorSnap = await getDoc(mentorRef);

  if (!mentorSnap.exists()) {
    await setDoc(mentorRef, {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
      tutors: [],
    });
    console.log("mentor created:", user.displayName);
  } else {
    console.log("mentor already exists:", user.displayName);
  }
}
