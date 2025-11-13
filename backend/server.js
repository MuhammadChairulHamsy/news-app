import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 5000;
const BASE_URL = "https://newsapi.org/v2/everything";
const API_KEY = "a96b36ec4cf54815881fb3431f092f0a";

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  })
);

app.get("/api/news", async (req, res) => {
  try {
    const topic = req.query.q || "tesla";
    const url = `${BASE_URL}?q=${topic}&pageSize=5&sortBy=publishedAt&apiKey=${API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    const data = await response.json();
    console.log("✅ Data berita berhasil diambil");
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Gagal ambil data", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
