const modelingProjects = window.IPS_3D_PORTFOLIO || [];
const modelingGrid = document.querySelector("#modeling-page-grid");
const modelingEscape = (value = "") => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const modelingAsset = (value = "") => `../${value.replace(/^\.\//, "")}`;

function renderModelingPortfolio() {
  modelingGrid.innerHTML = modelingProjects.map((project, index) => `<article class="portfolio3d-card reveal">
    <button class="portfolio3d-card__preview" type="button" data-project-index="${index}" aria-label="View details for ${modelingEscape(project.title)}"><span class="portfolio3d-card__media"><img src="${modelingEscape(modelingAsset(project.image))}" alt="${modelingEscape(project.images[0]?.alt || project.title)}" loading="lazy" decoding="async" /><span class="portfolio3d-card__index">3D / ${String(index + 1).padStart(2, "0")}</span></span></button>
    <div class="portfolio3d-card__body"><img class="portfolio3d-card__icon" src="${modelingEscape(modelingAsset(project.thumbnail || project.image))}" alt="" loading="lazy" decoding="async" /><span class="portfolio3d-card__copy"><strong>${modelingEscape(project.title)}</strong><small>${modelingEscape(project.category)}</small><small class="portfolio3d-card__artist">${modelingEscape(project.artist || "IPS Studio")} · ${modelingEscape(project.source || "IPS Studio portfolio")}</small></span><button class="portfolio3d-card__cta" type="button" data-project-index="${index}">VIEW PROJECT <span aria-hidden="true">&#8594;</span></button></div>
  </article>`).join("");
  modelingGrid.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-project-index]");
    if (!trigger) return;
    const project = modelingProjects[Number(trigger.dataset.projectIndex)];
    window.IPS_PROJECT_MODAL.open({ ...project, artist: "IPS Studio", details: { Artist: "IPS Studio", Source: project.source || "IPS Studio portfolio" } }, { portfolio: "3D Portfolio" });
  });
}

renderModelingPortfolio();
document.querySelector("#current-year").textContent = String(new Date().getFullYear());
window.IPS_OBSERVE_REVEALS?.();
