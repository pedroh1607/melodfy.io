async function fetchArtists() {
  // Detectar ambiente:
  // - file:// = abrir HTML local, usar localhost
  // - http://localhost:3000 = rodar localmente com Node
  // - outro domínio = Vercel ou outro hosting (usa /api/...)
  let url = "/api/artists";
  
  if (location.protocol === "file:") {
    url = "http://localhost:3000/api/artists";
  } else if (location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
    // Se estiver em um domínio (Vercel, GitHub Pages com proxy, etc.), usa /api/...
    // que é relativo ao servidor
    url = `${location.origin}/api/artists`;
  }

  const response = await fetch(url);
  let data;

  try {
    data = await response.json();
  } catch (e) {
    throw new Error("Resposta inválida do servidor");
  }

  if (!response.ok) {
    throw new Error(data.error || response.statusText || "Erro ao buscar artistas");
  }

  return data;
}

async function renderArtists() {
  const grid = document.getElementById("artists-grid");

  try {
    const albums = await fetchArtists();

    if (!Array.isArray(albums) || albums.length === 0) {
      grid.innerHTML = "<p>Nenhum álbum encontrado.</p>";
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
