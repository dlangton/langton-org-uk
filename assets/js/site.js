const albumLabels = {
  cats: "Cats",
  uk_birds: "UK Birds",
};

const photos = [
  { album: "cats", title: "Cat portrait", src: "img/cats/190.webp" },
  { album: "cats", title: "Curious cat", src: "img/cats/IMG_2010.webp" },
  { album: "uk_birds", title: "Avocet", src: "img/uk_birds/Avocet--2.webp" },
  { album: "uk_birds", title: "Shoveler", src: "img/uk_birds/Shoveler-.webp" },
  { album: "uk_birds", title: "Brent Goose", src: "img/uk_birds/Brent-Goose--.webp" },
  { album: "uk_birds", title: "Black-headed Gull", src: "img/uk_birds/Blackheaded-Gull-.webp" },
  { album: "uk_birds", title: "Reed Bunting", src: "img/uk_birds/Reed Bunting.webp" },
  { album: "uk_birds", title: "Canada Goose", src: "img/uk_birds/Canada-goose.webp" },
  { album: "uk_birds", title: "Bearded Tit", src: "img/uk_birds/Bearded Tit.webp" },
  { album: "uk_birds", title: "Starling", src: "img/uk_birds/Starling.webp" },
  { album: "uk_birds", title: "Spotted Redshank", src: "img/uk_birds/Spotted-Redshank.webp" },
  { album: "uk_birds", title: "Redshank", src: "img/uk_birds/Redshank-.webp" },
  { album: "uk_birds", title: "Blue Tit", src: "img/uk_birds/Blue tit.webp" },
  { album: "uk_birds", title: "Black-tailed Godwit", src: "img/uk_birds/Black-tailed -godqit.webp" },
  { album: "uk_birds", title: "Sanderling", src: "img/uk_birds/Sanderling.webp" },
  { album: "uk_birds", title: "Kingfisher", src: "img/uk_birds/Kingfisher-1.webp" },
  { album: "uk_birds", title: "Bittern", src: "img/uk_birds/Bittern-1.webp" },
];

const getAlbumPhotos = (albumName) => {
  if (!albumName || albumName === "all") {
    return photos;
  }

  return photos.filter((photo) => photo.album === albumName);
};

function renderAlbumCards() {
  const container = document.getElementById("album-cards");
  if (!container) return;

  const albums = Object.keys(albumLabels).map((albumKey) => ({
    album: albumKey,
    label: albumLabels[albumKey],
    cover: getAlbumPhotos(albumKey)[0],
  }));

  container.innerHTML = albums
    .map(
      (album) => `
        <a class="album-card" href="gallery.html?album=${album.album}" aria-label="Open ${album.label} album">
          <img src="${album.cover ? album.cover.src : ""}" alt="${album.label} cover" />
          <div class="album-card-body">
            <h3>${album.label}</h3>
            <p>${getAlbumPhotos(album.album).length} photos</p>
          </div>
        </a>
      `
    )
    .join("");
}

function initSlideshow() {
  const image = document.getElementById("slideshow-image");
  const caption = document.getElementById("slideshow-caption");
  const prevButton = document.getElementById("slideshow-prev");
  const nextButton = document.getElementById("slideshow-next");

  if (!image || !caption || !prevButton || !nextButton) return;

  let index = 0;

  const updateSlide = () => {
    const photo = photos[index];
    if (!photo) {
      image.src = "";
      caption.textContent = "No photos available yet.";
      return;
    }

    image.src = photo.src;
    image.alt = photo.title;
    caption.textContent = `${photo.title} • ${albumLabels[photo.album]}`;
  };

  prevButton.addEventListener("click", () => {
    index = (index - 1 + photos.length) % photos.length;
    updateSlide();
  });

  nextButton.addEventListener("click", () => {
    index = (index + 1) % photos.length;
    updateSlide();
  });

  setInterval(() => {
    index = (index + 1) % photos.length;
    updateSlide();
  }, 5000);

  updateSlide();
}

function renderGalleryFilters(selectedAlbum = "all") {
  const toolbar = document.getElementById("album-toolbar");
  if (!toolbar) return;

  const albums = [
    { value: "all", label: "All photos" },
    ...Object.entries(albumLabels).map(([value, label]) => ({ value, label })),
  ];

  toolbar.innerHTML = albums
    .map(
      (album) => `
        <button
          type="button"
          class="filter-button ${selectedAlbum === album.value ? "active" : ""}"
          data-album="${album.value}"
          aria-pressed="${selectedAlbum === album.value}"
        >
          ${album.label}
        </button>
      `
    )
    .join("");

  toolbar.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      const album = button.dataset.album;
      selectedAlbum = album;
      history.replaceState(null, "", album === "all" ? "gallery.html" : `gallery.html?album=${album}`);
      renderGallery(selectedAlbum);
      renderGalleryFilters(selectedAlbum);
    });
  });
}

function renderGallery(selectedAlbum = "all") {
  const gallery = document.getElementById("gallery-grid");
  if (!gallery) return;

  const visiblePhotos = getAlbumPhotos(selectedAlbum);

  if (!visiblePhotos.length) {
    gallery.innerHTML = '<div class="empty-state">No photos are available in this album yet.</div>';
    return;
  }

  gallery.innerHTML = visiblePhotos
    .map(
      (photo, index) => `
        <button
          type="button"
          class="gallery-card"
          data-index="${index}"
          aria-label="Open ${photo.title} from ${albumLabels[photo.album]}"
        >
          <img src="${photo.src}" alt="${photo.title}" />
          <figcaption>
            <span>${photo.title}</span>
            <span>${albumLabels[photo.album]}</span>
          </figcaption>
        </button>
      `
    )
    .join("");

  gallery.querySelectorAll(".gallery-card").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      openLightbox(visiblePhotos, index);
    });
  });
}

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const closeButton = document.getElementById("lightbox-close");
const prevButton = document.getElementById("lightbox-prev");
const nextButton = document.getElementById("lightbox-next");

let currentLightboxPhotos = [];
let currentLightboxIndex = 0;

function updateLightbox() {
  if (!lightbox || !lightboxImage || !lightboxCaption) return;

  const photo = currentLightboxPhotos[currentLightboxIndex];
  if (!photo) return;

  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.title;
  lightboxCaption.textContent = `${photo.title} • ${albumLabels[photo.album]}`;
}

function openLightbox(photosForLighting, index) {
  if (!lightbox) return;

  currentLightboxPhotos = photosForLighting;
  currentLightboxIndex = index;
  updateLightbox();
  lightbox.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox) return;

  lightbox.classList.add("hidden");
  document.body.style.overflow = "";
}

if (closeButton) {
  closeButton.addEventListener("click", closeLightbox);
}

if (prevButton) {
  prevButton.addEventListener("click", () => {
    if (!currentLightboxPhotos.length) return;
    currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxPhotos.length) % currentLightboxPhotos.length;
    updateLightbox();
  });
}

if (nextButton) {
  nextButton.addEventListener("click", () => {
    if (!currentLightboxPhotos.length) return;
    currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxPhotos.length;
    updateLightbox();
  });
}

window.addEventListener("keydown", (event) => {
  if (lightbox && !lightbox.classList.contains("hidden")) {
    if (event.key === "Escape") {
      closeLightbox();
    }
    if (event.key === "ArrowLeft") {
      prevButton?.click();
    }
    if (event.key === "ArrowRight") {
      nextButton?.click();
    }
  }
});

function initializePage() {
  renderAlbumCards();
  initSlideshow();

  const albumParam = new URLSearchParams(window.location.search).get("album");
  const initialAlbum = albumParam && albumLabels[albumParam] ? albumParam : "all";
  renderGalleryFilters(initialAlbum);
  renderGallery(initialAlbum);
}

document.addEventListener("DOMContentLoaded", initializePage);
