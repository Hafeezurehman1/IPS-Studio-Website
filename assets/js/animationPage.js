const animationCatalog = window.IPS_ANIMATIONS || [];
const animationPageGrid = document.querySelector("#animation-page-grid");
const animationPageAsset = (value = "") => `../${value.replace(/^\.\//, "")}`;
const animationPageEscape = (value = "") => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
animationPageGrid.innerHTML = animationCatalog.map((project, index) => `<article class="animation-page-card reveal">
  <button class="animation-page-card__preview" type="button" data-animation-index="${index}" aria-label="View ${animationPageEscape(project.title)} project">
    <span class="animation-page-card__media"><img src="${animationPageEscape(animationPageAsset(project.poster))}" alt="${animationPageEscape(project.title)} animation still" loading="lazy" decoding="async" /><span class="animation-page-card__play" aria-hidden="true">&#9654;</span></span>
  </button>
  <div class="animation-page-card__copy"><small>${animationPageEscape(project.category)}</small><h2>${animationPageEscape(project.title)}</h2><button class="animation-page-card__cta" type="button" data-animation-index="${index}">VIEW PROJECT <span aria-hidden="true">&#8594;</span></button></div>
</article>`).join("");
animationPageGrid.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-animation-index]");
  if (!trigger) return;
  const project = animationCatalog[Number(trigger.dataset.animationIndex)];
  window.IPS_PROJECT_MODAL.open({
    id: project.id,
    artist: project.artist || "IPS Studio",
    title: project.title,
    category: project.category,
    description: project.description,
    images: [{ src: project.poster, alt: `${project.title} animation poster`, label: "Poster" }],
    video: project.video,
    poster: project.poster,
    details: { Artist: project.artist || "IPS Studio", Source: project.source || "IPS Studio portfolio" },
  }, { portfolio: "Animation Portfolio" });
});
document.querySelector("#current-year").textContent = String(new Date().getFullYear());
window.IPS_OBSERVE_REVEALS?.();
