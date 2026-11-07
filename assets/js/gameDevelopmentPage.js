const devProjects = window.IPS_GAME_DEVELOPMENT || [];
const devGrid = document.querySelector("#game-development-page-grid");
const devDialog = document.querySelector("#dev-case-dialog");
const devDialogContent = document.querySelector("#dev-case-dialog-content");

function devEscape(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#39;" }[char]));
}

function renderDevProjects() {
  if (!devProjects.length) {
    devGrid.innerHTML = `<div class="game-development-empty game-development-empty--page"><span class="game-development-empty__index">CASE STUDIES / IN PREPARATION</span><div><p class="eyebrow"><span class="eyebrow-dash"></span> Development portfolio</p><h3>Real projects.<br /><em>Clear context.</em></h3><p>There are no standalone game-development case studies in this project yet. This page is ready for approved gameplay footage, implementation notes, technology details and project credits.</p><a class="button button--primary" href="../index.html#contact">Discuss a game project <span aria-hidden="true">\u2192</span></a></div><span class="game-development-empty__mark" aria-hidden="true">IPS<span> / DEV</span></span></div>`;
    return;
  }
  devGrid.innerHTML = devProjects.map((project,index) => `<article class="portfolio3d-card reveal"><a class="portfolio3d-card__preview" href="?project=${encodeURIComponent(project.slug)}" data-dev-project="${devEscape(project.slug)}"><span class="portfolio3d-card__media">${project.video ? `<video muted autoplay loop playsinline preload="none" poster="${devEscape(project.poster || project.image)}" data-video-src="${devEscape(project.video)}" aria-label="${devEscape(project.title)} gameplay"></video>` : `<img src="${devEscape(project.image)}" alt="${devEscape(project.imageAlt || project.title)}" loading="lazy" />`}<span class="portfolio3d-card__index">DEV / ${String(index+1).padStart(2,"0")}</span></span></a><div class="portfolio3d-card__body"><img class="portfolio3d-card__icon" src="${devEscape(project.thumbnail || project.image)}" alt="" loading="lazy" /><span class="portfolio3d-card__copy"><strong>${devEscape(project.title)}</strong><small>${devEscape(project.category)}</small></span><a class="portfolio3d-card__cta" href="?project=${encodeURIComponent(project.slug)}" data-dev-project="${devEscape(project.slug)}">View Project <span aria-hidden="true">\u2192</span></a></div></article>`).join("");
  devGrid.querySelectorAll("[data-dev-project]").forEach((link) => link.addEventListener("click", (event) => { event.preventDefault(); openDevProject(link.dataset.devProject); }));
  observeDevVideos();
}

function openDevProject(slug) {
  const project = devProjects.find((entry) => entry.slug === slug);
  if (!project) return;
  const list = (items) => Array.isArray(items) ? items : (items ? [items] : []);
  const section = (label, items) => { const values=list(items); return values.length ? `<section><h3>${label}</h3>${values.map((value)=>`<p>${devEscape(value)}</p>`).join("")}</section>` : ""; };
  const tags = list(project.technology);
  const features = list(project.features);
  const gallery = list(project.gallery);
  devDialogContent.innerHTML = `<div class="dev-case-dialog__layout"><div class="dev-case-dialog__media">${project.video ? `<video controls playsinline preload="metadata" poster="${devEscape(project.poster || project.image)}" src="${devEscape(project.video)}"></video>` : `<img src="${devEscape(project.image)}" alt="${devEscape(project.imageAlt || project.title)}" />`}</div><div class="dev-case-dialog__copy"><p class="eyebrow"><span class="eyebrow-dash"></span> Game Development / Case Study</p><h2 id="dev-case-dialog-title">${devEscape(project.title)}</h2><p class="portfolio3d-dialog__category">${devEscape(project.category)}</p>${section("Overview",project.overview || project.description)}${section("Development Work",project.developmentWork)}${section("Gameplay",project.gameplay)}${section("Platform",project.platform)}${features.length?`<section><h3>Features</h3><ul>${features.map((x)=>`<li>${devEscape(x)}</li>`).join("")}</ul></section>`:""}${tags.length?`<section class="dev-case-dialog__tags"><h3>Technology</h3><div>${tags.map((x)=>`<span>${devEscape(x)}</span>`).join("")}</div></section>`:""}</div></div>${gallery.length?`<div class="dev-case-dialog__gallery">${gallery.map((item)=>`<img src="${devEscape(typeof item === "string" ? item : item.src)}" alt="${devEscape(typeof item === "string" ? project.title : item.alt || project.title)}" loading="lazy" />`).join("")}</div>`:""}`;
  devDialog.showModal();
}

function observeDevVideos() {
  const videos=devGrid.querySelectorAll("video[data-video-src]");
  if (!videos.length) return;
  if (!("IntersectionObserver" in window)) { videos.forEach((v)=>{v.src=v.dataset.videoSrc;v.load();v.play().catch(()=>{});});return; }
  const io=new IntersectionObserver((entries)=>entries.forEach(({target,isIntersecting})=>{if(isIntersecting){if(!target.src){target.src=target.dataset.videoSrc;target.load();}target.play().catch(()=>{});}else target.pause();}),{rootMargin:"120px 0px",threshold:.15});
  videos.forEach((video)=>io.observe(video));
}

renderDevProjects();
window.IPS_OBSERVE_REVEALS?.();
document.querySelector("#current-year").textContent=String(new Date().getFullYear());
devDialog.querySelector(".portfolio3d-dialog__close").addEventListener("click",()=>devDialog.close());
devDialog.addEventListener("click",(event)=>{if(event.target===devDialog)devDialog.close();});
const requestedProject=new URLSearchParams(location.search).get("project");
if(requestedProject)openDevProject(requestedProject);
