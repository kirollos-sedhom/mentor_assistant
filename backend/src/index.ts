// backend/src/index.ts

import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const serviceAccountPath = path.resolve(__dirname, "../serviceAccountKey.json");
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("✅ mentor assistant backend is running!");
});

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();
const ai = new GoogleGenAI({});
app.get("/test-ai", async (req, res) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
  res.json({ message: response.text });
});

app.post("/test", (req, res) => {
  console.log("received:", req.body);
  res.json({ message: "data received successfully" });
});

app.get("/test-db", async (req, res) => {
  const docRef = db.collection("debug").doc("ping");
  await docRef.set({ time: new Date().toISOString() });
  res.send("🔥 Firestore test write done!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
