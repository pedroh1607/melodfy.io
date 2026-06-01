import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.static("public"));

const CLIENT_ID = "7baec1fac0b3443899a8e6245a9c233e";
const CLIENT_SECRET = "0bb12ad0a875473ab69b4129e4e1ba6c";

// 🔐 pegar token
async function getAccessToken() {
  const response = await fetch(
    "https://accounts.spotify.com/api/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    }
  );

  const data = await response.json();
  return data.access_token;
}

// 🎧 endpoint para frontend
app.get("/api/artists", async (req, res) => {
  try {
    const token = await getAccessToken();

    const response = await fetch(
      "https://api.spotify.com/v1/browse/new-releases",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    res.json(data.albums.items);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar dados" });
  }
});

app.listen(3000, () => {
  console.log("✅ Servidor rodando em http://localhost:3000");
});
