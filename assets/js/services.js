/* IPS Studio services. Cards use a small inline icon set and contain no project thumbnails. */
const IPS_SERVICE_ICONS = {
  "game-development": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 8h9a4.5 4.5 0 0 1 4.4 5.5l-.5 2.2a2 2 0 0 1-3.3 1L14.8 14H9.2l-2.3 2.7a2 2 0 0 1-3.3-1l-.5-2.2A4.5 4.5 0 0 1 7.5 8Z"/><path d="M8 10.5v4M6 12.5h4M16.5 11.5h.01M18.5 13.5h.01"/></svg>',
  "3d-modeling": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4.3 7.7 7.7 4.4 7.7-4.4M12 12.1V21"/></svg>',
  animation: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3V9ZM7 5v2M12 5v2M17 5v2M7 17v2M12 17v2M17 17v2"/></svg>',
  "ui-ux-design": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 9v11M11.5 13h6M11.5 16h4"/></svg>',
  "aso-services": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5M4 19h16"/><path d="m7 15 4-4 3 2 5-6M15 7h4v4"/></svg>',
  "game-art": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m14.5 5.5 4 4M4 20l4.6-1 10.7-10.7a2.8 2.8 0 0 0-4-4L4.6 15 4 20Z"/><path d="m13 7 4 4"/></svg>',
};

window.IPS_SERVICES = [
  {
    id: "game-development", number: "01", title: "GAME DEVELOPMENT", category: "Gameplay / Systems",
    description: "We build engaging gameplay systems, mechanics and interactive experiences from concept to playable product.",
    offerings: ["Engaging gameplay systems", "Game mechanics", "Interactive experiences", "Concept to playable product"],
    label: "VIEW GAMES", homeHref: "./games/index.html", pageHref: "../games/index.html",
  },
  {
    id: "3d-modeling", number: "02", title: "3D MODELING", category: "3D Modeling / CAD",
    description: "Game-ready assets, environments, characters, props and carefully detailed CAD and product models.",
    offerings: ["Game-ready assets", "Environments", "Characters and props", "CAD and product models"],
    label: "VIEW 3D MODELING", homeHref: "./3d-modeling/index.html", pageHref: "../3d-modeling/index.html",
  },
  {
    id: "animation", number: "03", title: "3D ANIMATION", category: "Animation / Motion",
    description: "Character, cinematic and game animation created to bring digital worlds and assets to life.",
    offerings: ["Character animation", "Cinematic animation", "Game animation"],
    label: "VIEW ANIMATION", homeHref: "./animation/index.html", pageHref: "../animation/index.html",
  },
  {
    id: "ui-ux-design", number: "04", title: "UI/UX DESIGN", category: "Interface / Player Experience",
    description: "User-focused interfaces and digital experiences designed for clarity, usability and conversion.",
    offerings: ["User-focused interfaces", "Digital experiences", "Clarity and usability", "Conversion-focused design"],
    label: "VIEW UI/UX PROJECTS", homeHref: "./portfolio.html?portfolio=ui-ux-design#portfolio", pageHref: "../portfolio.html?portfolio=ui-ux-design#portfolio",
  },
  {
    id: "aso-services", number: "05", title: "ASO SERVICES", category: "Marketing / App Store Optimization",
    description: "Improve your app’s visibility, increase organic downloads, and optimize your store listing to attract more users.",
    offerings: ["Keyword research", "App title and description optimization", "Store listing improvements", "App growth strategy"],
    label: "DISCUSS ASO SERVICES", homeHref: "./index.html#contact", pageHref: "../index.html#contact",
  },
  {
    id: "game-art", number: "06", title: "GAME ART", category: "Visual Development",
    description: "Game environments, props, visual assets and UI created for polished interactive experiences.",
    offerings: ["Game environments", "Props", "Visual assets", "UI for interactive experiences"],
    label: "VIEW GAME ART", homeHref: "./portfolio.html?portfolio=game-art#portfolio", pageHref: "../portfolio.html?portfolio=game-art#portfolio",
  },
];

window.IPS_RENDER_SERVICES = function (container, context = "home") {
  if (!container) return;
  const escape = (value = "") => String(value).replace(/[&<>\"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '\"': "&quot;", "'": "&#39;" })[character]);
  container.classList.remove("services-list--expandable");
  container.innerHTML = (window.IPS_SERVICES || []).map((service) => {
    const offerings = service.offerings?.length
      ? `<ul class="service-card__offerings" aria-label="${escape(service.title)} offerings">${service.offerings.map((item) => `<li>${escape(item)}</li>`).join("")}</ul>`
      : "";
    return `<article class="service-card${context === "home" ? " service-card--home" : ""}${service.id === "aso-services" ? " service-card--aso" : ""} reveal" id="service-${escape(service.id)}" data-service-id="${escape(service.id)}">
      <div class="service-card__top"><span class="service-card__icon" aria-hidden="true">${IPS_SERVICE_ICONS[service.id] || ""}</span><span class="service-card__number" aria-label="Service ${escape(service.number)}">${escape(service.number)}</span></div>
      <div class="service-card__copy"><small>${escape(service.category)}</small><h3>${escape(service.title)}</h3><p>${escape(service.description)}</p>
        <div class="service-card__divider" aria-hidden="true"></div>${offerings}
        <a class="service-card__cta" href="${escape(context === "home" ? service.homeHref : service.pageHref)}">${escape(service.label)} <span aria-hidden="true">&#8594;</span></a>
      </div>
    </article>`;
  }).join("");
  container.parentElement?.querySelector(`[data-services-toggle="${context}"]`)?.remove();
  window.IPS_OBSERVE_REVEALS?.(container);
};
