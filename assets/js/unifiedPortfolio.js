(() => {
  const section = document.querySelector("#portfolio");
  const grid = document.querySelector("#portfolio-project-grid");
  if (!section || !grid) return;

  const escape = (value = "") => String(value).replace(/[&<>\"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '\"': "&quot;", "'": "&#39;" })[character]);
  const labels = {
    "game-development": "Game Development",
    "3d-modeling": "3D Modeling",
    "3d-animation": "3D Animation",
    marketing: "Marketing & ASO",
    "ui-ux-design": "UI/UX Design",
    "game-art": "Game Art",
  };
  const gameDevelopment = (window.IPS_GAME_DEVELOPMENT || []).map((project) => ({
    ...project,
    type: "game-development",
    portfolioCategory: "game-development",
  }));
  const modelingIds = new Set(["racing-kart", "organic-textured-jewelry", "zero-coke-can"]);
  const modeling = (window.IPS_3D_PORTFOLIO || []).map((project) => ({
    ...project,
    type: "3d",
    portfolioCategory: modelingIds.has(project.id) ? "3d-modeling" : "game-art",
  }));
  const animations = (window.IPS_ANIMATIONS || []).map((project) => ({
    ...project,
    type: "animation",
    portfolioCategory: "3d-animation",
    image: project.poster,
    imageAlt: `${project.title} 3D animation poster`,
  }));
  const interfaces = (window.IPS_UIUX_PORTFOLIO || []).map((project) => ({
    ...project,
    type: "uiux",
    portfolioCategory: "ui-ux-design",
  }));
  const byCategory = {
    "game-development": gameDevelopment,
    "3d-modeling": modeling.filter((project) => project.portfolioCategory === "3d-modeling"),
    "3d-animation": animations,
    marketing: [],
    "ui-ux-design": interfaces,
    "game-art": modeling.filter((project) => project.portfolioCategory === "game-art"),
  };
  const categoryOrder = ["game-development", "3d-modeling", "3d-animation", "marketing", "ui-ux-design", "game-art"];
  const projects = [];
  const longest = Math.max(0, ...categoryOrder.map((category) => byCategory[category].length));
  for (let index = 0; index < longest; index += 1) {
    categoryOrder.forEach((category) => {
      if (byCategory[category][index]) projects.push(byCategory[category][index]);
    });
  }

  const projectById = new Map(projects.map((project) => [project.id, project]));
  const featuredProject = modeling.find((project) => project.id === "racing-kart");
  const cardProjects = projects.filter((project) => project.id !== featuredProject?.id);
  const featuredCard = section.querySelector("#portfolio-featured-3d");
  const filters = [...section.querySelectorAll("[data-portfolio-filter]")];
  const empty = section.querySelector("#portfolio-empty");
  const status = section.querySelector("#portfolio-filter-status");
  const exploreToggle = section.querySelector("[data-portfolio-toggle]");
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const cardLabel = (category) => labels[category] || "IPS Studio";

  const imageMarkup = (project) => `<span class="portfolio-project-card__image"><img src="${escape(project.image)}" alt="${escape(project.imageAlt || project.title)}" loading="lazy" decoding="async" /><span class="portfolio-project-card__number">${escape(cardLabel(project.portfolioCategory))}</span></span>`;
  const previewMarkup = (project) => `<button class="portfolio-project-card__preview" type="button" data-portfolio-project-id="${escape(project.id)}" aria-label="View ${escape(project.title)} project">${imageMarkup(project)}</button>`;
  const projectAction = (project) => `<button class="portfolio-project__action" type="button" data-portfolio-project-id="${escape(project.id)}">View Project <span aria-hidden="true">&#8594;</span></button>`;

  grid.innerHTML = cardProjects.map((project) => `
    <article class="portfolio-project-card" data-portfolio-category="${escape(project.portfolioCategory)}" data-portfolio-project-card="${escape(project.id)}">
      ${previewMarkup(project)}
      <div class="portfolio-project-card__copy">
        <p class="portfolio-project-card__category">${escape(cardLabel(project.portfolioCategory))}</p>
        <h3>${escape(project.title)}</h3>
        <p class="portfolio-project-card__description">${escape(project.description || "Selected work from the IPS Studio portfolio.")}</p>
        ${projectAction(project)}
      </div>
    </article>`).join("");

  const openProject = (projectId) => {
    const project = projectById.get(projectId);
    if (!project || !window.IPS_PROJECT_MODAL?.open) return;
    if (project.type === "animation") {
      window.IPS_PROJECT_MODAL.open({
        id: project.id,
        title: project.title,
        category: project.category,
        description: project.description,
        artist: "IPS Studio",
        images: [{ src: project.poster, alt: `${project.title} animation poster`, label: "Poster" }],
        video: project.video,
        poster: project.poster,
        details: { Artist: "IPS Studio", Source: project.source || "IPS Studio portfolio" },
      }, { portfolio: "3D Animation Portfolio" });
      return;
    }
    const images = project.images?.length ? project.images : [{ src: project.image, alt: project.imageAlt || project.title, label: "Project image" }];
    window.IPS_PROJECT_MODAL.open({
      ...project,
      images,
      artist: "IPS Studio",
      details: { ...project.details, Artist: "IPS Studio", Source: project.source || "IPS Studio portfolio" },
    }, { portfolio: project.type === "uiux" ? "UI/UX Design Portfolio" : `${labels[project.portfolioCategory]} Portfolio` });
  };

  const filterCards = [featuredCard, ...grid.querySelectorAll("[data-portfolio-project-card]")].filter(Boolean);
  let selectedCategory = "all";
  let expanded = false;
  let renderCycle = 0;
  let currentInitialVisibleCount = 4;

  const getInitialVisibleCount = (category = selectedCategory) => {
    const mobile = window.matchMedia?.("(max-width: 700px)").matches;
    const tablet = window.matchMedia?.("(max-width: 1050px)").matches;
    const featuredMatches = featuredCard && (category === "all" || featuredCard.dataset.portfolioCategory === category);
    return mobile || (tablet && featuredMatches) ? 3 : 4;
  };

  const renderCollection = ({ animate = true, collapseExtras = false } = {}) => {
    const category = selectedCategory;
    const renderToken = ++renderCycle;
    const matchingCards = filterCards.filter((card) => category === "all" || card.dataset.portfolioCategory === category);
    currentInitialVisibleCount = getInitialVisibleCount(category);
    const visibleLimit = expanded ? matchingCards.length : currentInitialVisibleCount;
    let matchingIndex = 0;
    let visibleCount = 0;

    filterCards.forEach((card) => {
      const matches = category === "all" || card.dataset.portfolioCategory === category;
      if (!matches) {
        card.hidden = true;
        card.inert = true;
        card.setAttribute("aria-hidden", "true");
        card.classList.remove("is-filter-entering", "is-collapsing");
        return;
      }

      const cardIndex = matchingIndex++;
      const shouldShow = cardIndex < visibleLimit;
      if (shouldShow) {
        const wasHidden = card.hidden;
        card.hidden = false;
        card.inert = false;
        card.removeAttribute("aria-hidden");
        card.classList.remove("is-collapsing");
        if (animate && wasHidden && !reduceMotion) {
          card.style.setProperty("--filter-index", String(Math.min(cardIndex, 12)));
          card.classList.add("is-filter-entering");
        } else {
          card.classList.remove("is-filter-entering");
        }
        visibleCount += 1;
        return;
      }

      card.classList.remove("is-filter-entering");
      if (collapseExtras && !reduceMotion && !card.hidden) {
        card.inert = true;
        card.setAttribute("aria-hidden", "true");
        card.classList.add("is-collapsing");
        window.setTimeout(() => {
          if (renderToken !== renderCycle || expanded || selectedCategory !== category) return;
          card.hidden = true;
          card.classList.remove("is-collapsing");
        }, 190);
      } else {
        card.hidden = true;
        card.inert = true;
        card.setAttribute("aria-hidden", "true");
        card.classList.remove("is-collapsing");
      }
    });

    const hasMoreThanInitial = matchingCards.length > currentInitialVisibleCount;
    if (exploreToggle) {
      exploreToggle.hidden = !hasMoreThanInitial;
      exploreToggle.setAttribute("aria-expanded", String(expanded && hasMoreThanInitial));
      exploreToggle.innerHTML = expanded
        ? 'SHOW LESS <span aria-hidden="true">↑</span>'
        : 'EXPLORE NOW <span aria-hidden="true">→</span>';
    }
    if (empty) empty.hidden = matchingCards.length > 0;
    if (matchingCards.length === 0 && empty) {
      const title = empty.querySelector("[data-portfolio-empty-title]");
      const message = empty.querySelector("[data-portfolio-empty-message]");
      const link = empty.querySelector("[data-portfolio-empty-link]");
      const copy = category === "game-development"
        ? { title: "Published games live in the game catalog.", message: "The project repository does not include standalone game development case studies with separate supporting details. Browse the published game listings instead.", link: "EXPLORE GAMES", href: "./games/index.html" }
        : { title: "No marketing case studies are listed yet.", message: "There are no verified marketing or ASO portfolio examples in the current project. Contact IPS Studio to discuss a campaign or app store project.", link: "DISCUSS A PROJECT", href: "./index.html#contact" };
      if (title) title.textContent = copy.title;
      if (message) message.textContent = copy.message;
      if (link) { link.href = copy.href; link.innerHTML = `${escape(copy.link)} <span aria-hidden="true">&#8594;</span>`; }
    }
    if (status) status.textContent = matchingCards.length === 0
      ? category === "game-development" ? "Published game listings are shown in the game collection above." : "No verified marketing portfolio examples are available yet."
      : expanded
        ? `Showing all ${matchingCards.length} ${matchingCards.length === 1 ? "project" : "projects"}.`
        : hasMoreThanInitial
          ? `Showing ${visibleCount} of ${matchingCards.length} projects.`
          : `Showing ${matchingCards.length} ${matchingCards.length === 1 ? "project" : "projects"}.`;
  };

  window.addEventListener?.("resize", () => {
    const nextVisibleCount = getInitialVisibleCount();
    if (nextVisibleCount === currentInitialVisibleCount) return;
    currentInitialVisibleCount = nextVisibleCount;
    renderCollection({ animate: false });
  }, { passive: true });

  const setFilter = (category, animate = true) => {
    if (category !== "all" && !Object.hasOwn(labels, category)) return;
    selectedCategory = category;
    expanded = false;
    filters.forEach((button) => {
      const selected = button.dataset.portfolioFilter === category;
      button.setAttribute("aria-pressed", String(selected));
      button.classList.toggle("is-active", selected);
    });
    renderCollection({ animate });
    window.IPS_OBSERVE_REVEALS?.(grid);
    document.dispatchEvent(new CustomEvent("ips:portfolio-filter", { detail: { category } }));
  };

  filters.forEach((button) => button.addEventListener("click", () => setFilter(button.dataset.portfolioFilter)));
  exploreToggle?.addEventListener("click", () => {
    if (exploreToggle.hidden) return;
    expanded = !expanded;
    renderCollection({ animate: true, collapseExtras: !expanded });
  });
  document.querySelectorAll("[data-portfolio-filter-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      setFilter(link.dataset.portfolioFilterLink);
      if (link.closest(".main-nav") || link.hash === "#portfolio") section.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  });
  section.addEventListener("click", (event) => {
    const trigger = event.target.closest("button[data-portfolio-project-id]");
    if (trigger) openProject(trigger.dataset.portfolioProjectId);
  });

  const requestedFilter = new URLSearchParams(window.location.search).get("portfolio") || "all";
  setFilter(requestedFilter, false);
  window.IPS_PORTFOLIO_PROJECTS = projects;
})();
