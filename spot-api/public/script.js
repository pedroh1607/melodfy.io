async function fetchArtists() {
  const response = await fetch("http://localhost:3000/api/artists");
  return await response.json();
}

async function renderArtists() {
  const grid = document.getElementById("artists-grid");

  try {
    const albums = await fetchArtists();

    grid.innerHTML = "";

    albums.forEach(album => {
      const card = document.createElement("div");
      card.classList.add("artist-card");

      card.innerHTML = `
        <img src="${album.images[0]?.url}" />
        <h3>${album.name}</h3>
        <p>${album.artists[0]?.name}</p>
      `;

      grid.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    grid.innerHTML = "<p>Erro ao carregar 😢</p>";
  }
}

document.addEventListener("DOMContentLoaded", renderArtists);
