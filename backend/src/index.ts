// backend/src/index.ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import admin from "firebase-admin";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ------------------------------------------------------------------
// 1. INITIALIZE FIREBASE ADMIN
// ------------------------------------------------------------------
// (Your original code for this was perfect)
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

// ------------------------------------------------------------------
// 2. INITIALIZE GENAI
// ------------------------------------------------------------------
// (This was also correct - we will use this global 'model' variable)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

// ------------------------------------------------------------------
// 3. (NEW) AUTH MIDDLEWARE
// ------------------------------------------------------------------
// We need to augment the Express Request type to hold our user
interface AuthRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ error: "Unauthorized: No token provided." });
  }

  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // Attach decoded token to request
    next(); // Continue to the next function
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(403).send({ error: "Forbidden: Invalid token." });
  }
};

// ------------------------------------------------------------------
// 4. YOUR API ENDPOINTS
// ------------------------------------------------------------------
app.get("/", (req, res) => {
  res.send("✅ mentor assistant backend is running!");
});

app.get(
  "/summary/:mentorId/:tutorId",
  verifyToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const { mentorId, tutorId } = req.params;

      // --- (NEW) Security Check ---
      // Check if the authenticated user's ID matches the mentorId in the URL
      if (req.user?.uid !== mentorId) {
        return res
          .status(403)
          .json({ error: "Forbidden: You can only access your own data." });
      }
      // --- End Security Check ---

      // 1. Fetch incidents from Firestore
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

      // 2. Prepare the prompt
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

      // 3. Call Gemini API
      // (REMOVED the bad 'model' definition)
      const result = await model.generateContent(prompt);
      const summary = result.response.text();

      // 4. Send back to frontend
      res.json({ summary });
    } catch (error) {
      console.error("Error generating summary:", error);
      res.status(500).json({ error: "Failed to generate summary." });
    }
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
