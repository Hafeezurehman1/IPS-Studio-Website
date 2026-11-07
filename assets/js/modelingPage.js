const jewelryProjects = window.IPS_JEWELRY_PORTFOLIO || [];
const existingModelingProjects = window.IPS_3D_PORTFOLIO || [];
const modelingEscape = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
const modelingAsset = (value = "") => `../${value.replace(/^\.\//, "")}`;

const classifiedExistingProjects = existingModelingProjects.map((project) => ({
  ...project,
  collection: project.collection || "general",
  filters: Array.isArray(project.filters) ? project.filters : [],
}));
const classifiedJewelryProjects = jewelryProjects.map((project) => {
  const isProductModeling = project.category === "CAD / Product Modeling";
  return {
    ...project,
    collection: "cad",
    filters: ["cad-modeling", ...(isProductModeling ? ["product-modeling"] : ["jewelry-design"])],
  };
});
const featuredJewelryProjects = ["profile-01", "profile-02", "profile-03"].flatMap((profileId) =>
  classifiedJewelryProjects.filter((project) => project.sourceProfileId === profileId).slice(0, 2),
);
const featuredJewelryIds = new Set(featuredJewelryProjects.map((project) => project.id));
const otherJewelryProjects = classifiedJewelryProjects.filter((project) => !featuredJewelryIds.has(project.id));
const existingCadProjects = classifiedExistingProjects.filter((project) => project.collection === "cad");

// A project belongs to exactly one visible filter group. Product/prop tags take
// precedence because some product renders also carry the broader CAD tag.
const projectGroup = (project) => {
  const filters = new Set(project.filters || []);
  const category = String(project.category || "").toLowerCase();
  if (filters.has("product-modeling") || filters.has("props-assets") || /product modeling|product & props modeling|props & assets/.test(category)) {
    return "product-props";
  }
  if (project.collection === "cad" || filters.has("cad-modeling") || filters.has("jewelry-design") || /cad|jewelry|jewel|ring|gemstone|diamond/.test(category)) {
    return "cad-jewelry";
  }
  return "general";
};

const candidateProjects = [
  ...classifiedExistingProjects,
  ...featuredJewelryProjects,
  ...otherJewelryProjects,
  ...existingCadProjects,
];
const uniqueProjects = [...new Map(candidateProjects.map((project) => [project.id, project])).values()]
  .map((project) => ({ ...project, mainCategory: projectGroup(project) }));
// Keep the default General view first, followed by CAD/Jewelry, then Product/Props.
const modelingProjects = ["general", "cad-jewelry", "product-props"]
  .flatMap((group) => uniqueProjects.filter((project) => project.mainCategory === group));

const modelingGrid = document.querySelector("#modeling-page-grid");
const filtersRoot = document.querySelector("#modeling-page-filters");
const status = document.querySelector("#modeling-page-status");
const categories = [
  { id: "all", label: "All 3D Work", matches: () => true },
  { id: "general", label: "General 3D Modeling", matches: (project) => project.mainCategory === "general" },
  { id: "cad-jewelry", label: "CAD & Jewelry Design", matches: (project) => project.mainCategory === "cad-jewelry" },
  { id: "product-props", label: "Product & Props Modeling", matches: (project) => project.mainCategory === "product-props" },
].map((category) => ({
  ...category,
  projects: [...new Map(modelingProjects.filter(category.matches).map((project) => [project.id, project])).values()],
}));

let activeCategoryId = "general";

function renderModelingPortfolio() {
  if (!modelingGrid || !filtersRoot) return;

  filtersRoot.innerHTML = categories.map((category) => `<button class="home-games__filter${category.id === activeCategoryId ? " is-active" : ""}" type="button" data-modeling-page-filter="${category.id}" aria-label="${modelingEscape(category.label)}, ${category.projects.length} project${category.projects.length === 1 ? "" : "s"}" aria-pressed="${category.id === activeCategoryId}"><span>${modelingEscape(category.label)}</span><small aria-hidden="true">${category.projects.length}</small></button>`).join("");
  modelingGrid.innerHTML = modelingProjects.map((project, index) => `<article class="portfolio3d-card reveal${project.authorizedTeamPortfolio ? " portfolio3d-card--jewelry" : ""}" data-project-id="${modelingEscape(project.id)}" data-collection="${project.collection}" data-main-category="${project.mainCategory}" data-project-index="${index}">
    <button class="portfolio3d-card__preview" type="button" data-project-index="${index}" aria-label="View details for ${modelingEscape(project.title)}"><span class="portfolio3d-card__media"><img src="${modelingEscape(modelingAsset(project.image))}" alt="${modelingEscape(project.images[0]?.alt || project.title)}" loading="lazy" decoding="async" /><span class="portfolio3d-card__index">3D / ${String(index + 1).padStart(2, "0")}</span></span></button>
    <div class="portfolio3d-card__body"><img class="portfolio3d-card__icon" src="${modelingEscape(modelingAsset(project.thumbnail || project.image))}" alt="" loading="lazy" decoding="async" /><span class="portfolio3d-card__copy"><strong>${modelingEscape(project.title)}</strong><small>${modelingEscape(project.category)}</small>${project.suppressCreatorDisplay ? "" : `<small class="portfolio3d-card__artist">${modelingEscape(project.artist || "IPS Studio")} · ${modelingEscape(project.source || "IPS Studio portfolio")}</small>`}</span><button class="portfolio3d-card__cta" type="button" data-project-index="${index}">VIEW PROJECT <span aria-hidden="true">&#8594;</span></button></div>
  </article>`).join("");

  modelingGrid.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-project-index]");
    if (!trigger) return;
    const project = modelingProjects[Number(trigger.dataset.projectIndex)];
    const details = project.suppressCreatorDisplay
      ? {}
      : { ...(project.details || {}), Artist: "IPS Studio", Source: project.source || "IPS Studio portfolio" };
    window.IPS_PROJECT_MODAL.open({ ...project, details }, { portfolio: "3D Portfolio" });
  });

  filtersRoot.addEventListener("click", (event) => {
    const button = event.target.closest("[data-modeling-page-filter]");
    if (!button) return;
    const nextCategory = categories.find((category) => category.id === button.dataset.modelingPageFilter);
    if (!nextCategory || activeCategoryId === nextCategory.id) return;
    activeCategoryId = nextCategory.id;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    filtersRoot.querySelectorAll("[data-modeling-page-filter]").forEach((filterButton) => {
      const selected = filterButton.dataset.modelingPageFilter === activeCategoryId;
      filterButton.classList.toggle("is-active", selected);
      filterButton.setAttribute("aria-pressed", String(selected));
    });
    modelingGrid.querySelectorAll(":scope > .portfolio3d-card").forEach((card, index) => {
      const matches = nextCategory.matches(modelingProjects[Number(card.dataset.projectIndex)]);
      card.classList.toggle("modeling-filter-hidden", !matches);
      if (!reducedMotion && matches) {
        card.style.setProperty("--modeling-filter-index", String(Math.min(index, 12)));
        card.classList.remove("modeling-filter-entering");
        requestAnimationFrame(() => card.classList.add("modeling-filter-entering"));
      } else {
        card.classList.remove("modeling-filter-entering");
      }
    });
    if (status) status.textContent = `${nextCategory.projects.length} ${nextCategory.label} projects available.`;
    window.IPS_OBSERVE_REVEALS?.(modelingGrid);
  });

  const initialCategory = categories.find((category) => category.id === activeCategoryId) || categories[0];
  modelingGrid.querySelectorAll(":scope > .portfolio3d-card").forEach((card) => {
    const matches = initialCategory.matches(modelingProjects[Number(card.dataset.projectIndex)]);
    card.classList.toggle("modeling-filter-hidden", !matches);
  });
  if (status) status.textContent = `${initialCategory.projects.length} ${initialCategory.label} projects available.`;
}

renderModelingPortfolio();
const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());
window.IPS_OBSERVE_REVEALS?.();
