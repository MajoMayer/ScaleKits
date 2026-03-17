(function () {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  const counter = document.getElementById("lightbox-counter");
  const thumbsContainer = document.getElementById("lightbox-thumbs");
  const btnClose = document.getElementById("lightbox-close");
  const btnPrev = document.getElementById("lightbox-prev");
  const btnNext = document.getElementById("lightbox-next");

  let photos = [];
  let current = 0;

  function open(photoList, index) {
    photos = photoList;
    current = index;
    buildThumbs();
    render();
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    photos = [];
    thumbsContainer.innerHTML = "";
  }

  function buildThumbs() {
    thumbsContainer.innerHTML = "";
    if (photos.length <= 1) return;
    photos.forEach(function (src, idx) {
      var thumb = document.createElement("img");
      thumb.src = src;
      thumb.alt = "Photo " + (idx + 1);
      thumb.className = "lightbox-thumb";
      thumb.addEventListener("click", function (e) {
        e.stopPropagation();
        current = idx;
        render();
      });
      thumbsContainer.appendChild(thumb);
    });
  }

  function render() {
    img.src = photos[current];
    img.alt = "Photo " + (current + 1) + " of " + photos.length;
    counter.textContent = (current + 1) + " / " + photos.length;

    var single = photos.length <= 1;
    btnPrev.classList.toggle("is-hidden", single);
    btnNext.classList.toggle("is-hidden", single);

    // Update active thumbnail
    var thumbs = thumbsContainer.querySelectorAll(".lightbox-thumb");
    thumbs.forEach(function (t, i) {
      t.classList.toggle("is-active", i === current);
    });

    // Scroll active thumb into view
    if (thumbs[current]) {
      thumbs[current].scrollIntoView({ block: "nearest", inline: "center" });
    }
  }

  function prev() {
    if (photos.length <= 1) return;
    current = (current - 1 + photos.length) % photos.length;
    render();
  }

  function next() {
    if (photos.length <= 1) return;
    current = (current + 1) % photos.length;
    render();
  }

  // Card click — open lightbox
  document.querySelectorAll(".card").forEach(function (card) {
    card.addEventListener("click", function () {
      var raw = card.getAttribute("data-photos");
      if (!raw) return;
      var list;
      try { list = JSON.parse(raw); } catch (e) { return; }
      if (!list || !list.length) return;
      open(list, 0);
    });
  });

  // Controls
  btnClose.addEventListener("click", close);
  btnPrev.addEventListener("click", function (e) { e.stopPropagation(); prev(); });
  btnNext.addEventListener("click", function (e) { e.stopPropagation(); next(); });

  // Click on dark background closes lightbox
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox || e.target === document.querySelector(".lightbox-main")) close();
  });

  // Keyboard navigation
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  });
})();
