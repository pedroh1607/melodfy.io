export default async function handler(req, res) {
  const CLIENT_ID = "SEU_CLIENT_ID";
  const CLIENT_SECRET = "SEU_CLIENT_SECRET";

  try {
    // pegar token
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    });

    const tokenData = await tokenResponse.json();
    const token = tokenData.access_token;

    // buscar dados
    const response = await fetch("https://api.spotify.com/v1/browse/new-releases", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    res.status(200).json(data.albums.items);

  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar dados" });
  }
}
``