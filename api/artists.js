const CLIENT_ID = "7baec1fac0b3443899a8c233e";
const CLIENT_SECRET = "0bb12ad0a875473ab69b4129e4e1ba6c";

async function getAccessToken() {
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  if (!data.access_token) {
    throw new Error(data.error?.description || "Falha ao obter token Spotify");
  }
  return data.access_token;
}

export default async function handler(req, res) {
  // Habilitar CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const token = await getAccessToken();

    const response = await fetch("https://api.spotify.com/v1/browse/new-releases", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Erro ao buscar novos lançamentos",
      });
    }

    res.json(data.albums.items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar dados: " + err.message });
  }
}
