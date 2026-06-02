async function fetchArtists() {
  const url = location.protocol === "file:" ? "http://localhost:3000/api/artists" : "/api/artists";
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
