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

// auth middleware

//

const ai = new GoogleGenAI({ apiKey: process.env.GEMENI_API_KEY });
app.get("/test-ai", async (req, res) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
  res.json({ message: response.text });
});

app.get("/summary/:mentorId/:tutorId", async (req, res) => {
  try {
    const { mentorId, tutorId } = req.params;

    const incidentsRef = db
      .collection("mentors")
      .doc(mentorId)
      .collection("tutors")
      .doc(tutorId)
      .collection("incidents");

    const snapshot = await incidentsRef.get();
    if (snapshot.empty) {
      return res.json({ summary: "No incidents to summarize yet." });
    }

    const incidentTexts = snapshot.docs.map((doc) => {
      const data = doc.data();
      const date = data.date?.toDate().toISOString() ?? "unknown date";
      return `${date}: ${data.description}`;
    });

    const prompt = `
You are an educational performance assistant.
Summarize these incidents about a tutor's behavior or performance.
Provide:
- A short summary (2–3 sentences)
- Key behavioral patterns
- Suggestions for improvement (if any)

Incidents:
${incidentTexts.join("\n")}
`;

    //
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    //
    // const summary = result.candidates[0].content?.parts[0].text;
    console.log("finding summary:...");
    if (result.candidates) {
      // console.log(result.candidates[0].content?.parts);
      if (result.candidates[0].content?.parts) {
        console.log(result.candidates[0].content?.parts[0].text);
        res.json({ summary: result.candidates[0].content?.parts[0].text });
      }
    }
  } catch (error) {
    res.json({ message: "something wrong happened" });
  }
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
