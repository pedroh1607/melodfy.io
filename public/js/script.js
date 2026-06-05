async function fetchArtists() {
  // Detectar ambiente:
  // - file:// = abrir HTML local, usar localhost
  // - servidor local ou Vercel = usar rota relativa /api/artists
  let url = "/api/artists";

  if (location.protocol === "file:") {
    url = "http://localhost:3000/api/artists";
  }

  console.log("fetching artists from", url);
  const response = await fetch(url);
  const text = await response.text();
  const contentType = response.headers.get("content-type") || "";

  if (!response.ok) {
    let errorMessage = response.statusText || "Erro ao buscar artistas";
    if (contentType.includes("application/json")) {
      try {
        const json = JSON.parse(text);
        errorMessage = json.error || json.message || errorMessage;
      } catch {
        errorMessage = text || errorMessage;
      }
    } else {
      errorMessage = text || errorMessage;
    }
    throw new Error(errorMessage);
  }

  if (!contentType.includes("application/json")) {
    throw new Error(`Resposta inesperada do servidor: ${text.slice(0, 200)}`);
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error(`Resposta não é JSON: ${text.slice(0, 200)}`);
  }

  return data;
}

async function renderArtists() {
  const grid = document.getElementById("artists-grid");

  try {
    const albums = await fetchArtists();

    if (!Array.isArray(albums) || albums.length === 0) {
      grid.innerHTML = "<p>Nenhum álbum encontrado.</p><img src='https://media.istockphoto.com/id/1980276924/vector/no-photo-thumbnail-graphic-element-no-found-or-available-image-in-the-gallery-or-album-flat.jpg?s=612x612&w=0&k=20&c=ZBE3NqfzIeHGDPkyvulUw14SaWfDj2rZtyiKv3toItk=' alt='Not found' />";
      return;
    }

    grid.innerHTML = "";

    albums.forEach(album => {
      const card = document.createElement("div");
      card.classList.add("artist-card");

      card.innerHTML = `
        <img src="${album.images[0]?.url || ""}" />
        <h3>${album.name || "Sem título"}</h3>
        <p>${album.artists[0]?.name || "Artista desconhecido"}</p>
      `;

      grid.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    grid.innerHTML = `<p>Erro ao carregar 😢<br>${err.message}</p>`;
  }
}

document.addEventListener("DOMContentLoaded", renderArtists);
