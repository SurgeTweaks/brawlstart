const express = require("express");
const axios = require("axios");
const admin = require("firebase-admin");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FIREBASE_DB_URL,
  });
  
const db = admin.firestore();

const BRAWL_API = "https://api.brawlstars.com/v1";
const AUTH_HEADER = { Authorization: `Bearer ${process.env.BRAWL_API_TOKEN}` };

app.get("/player/:tag", async (req, res) => {
  try {
    const tag = encodeURIComponent(`#${req.params.tag}`);
    const response = await axios.get(`${BRAWL_API}/players/${tag}`, { headers: AUTH_HEADER });
    const data = response.data;
    await db.collection("players").doc(tag).set(data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur en ligne sur le port ${PORT}`));