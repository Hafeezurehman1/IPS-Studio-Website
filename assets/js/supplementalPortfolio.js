window.IPS_UIUX_PORTFOLIO = [
  {
    id: "learning-platform-app",
    artist: "IPS Studio",
    source: "IPS Studio portfolio",
    title: "Learning Platform App",
    category: "Mobile App UI/UX",
    description: "Mobile learning screens, app mockups and a messaging flow from the supplied design folder.",
    image: "./assets/uiux/source-1/04.png",
    imageAlt: "E-learning app shown in a phone mockup on a dark background",
    images: [
      { src: "assets/uiux/source-1/04.png", alt: "E-learning app in a phone mockup", label: "App mockup" },
      { src: "assets/uiux/source-1/01.png", alt: "Mobile screen concepts for the learning platform", label: "Mobile screens" },
      { src: "assets/uiux/source-1/03.png", alt: "A multi-screen layout for the learning platform", label: "Screen layouts" },
      { src: "assets/uiux/source-1/05.png", alt: "Learning app home screen in a phone mockup", label: "Home screen" },
      { src: "assets/uiux/source-1/06.png", alt: "Interview questions and conversation screen concepts", label: "Conversation flow" },
      { src: "assets/uiux/source-1/08.png", alt: "Additional learning app screen concepts", label: "Interface details" },
    ],
  },
  {
    id: "analytics-dashboard",
    artist: "IPS Studio",
    source: "IPS Studio portfolio",
    title: "Analytics Dashboard",
    category: "Dashboard UI/UX",
    description: "Dark dashboard screens, data tables and supporting interface studies from the supplied design folder.",
    image: "./assets/uiux/source-2/02.png",
    imageAlt: "Dark analytics dashboard interface displayed on a laptop mockup",
    images: [
      { src: "assets/uiux/source-2/02.png", alt: "Analytics dashboard in a laptop mockup", label: "Dashboard" },
      { src: "assets/uiux/source-2/01.png", alt: "Dark interface layout and visual design", label: "Interface overview" },
      { src: "assets/uiux/source-2/03.png", alt: "Dashboard workflow and interface stages", label: "Workflow" },
      { src: "assets/uiux/source-2/05.png", alt: "Multiple analytics dashboard screens", label: "Dashboard screens" },
    ],
  },
  {
    id: "business-proposal-layouts",
    artist: "IPS Studio",
    source: "IPS Studio portfolio",
    title: "Business Proposal Layouts",
    category: "Presentation UI/UX",
    description: "A set of business proposal pages and visual layout studies from the supplied design folder.",
    image: "./assets/uiux/source-3/01.png",
    imageAlt: "Business proposal page layouts presented as a design board",
    images: [
      { src: "assets/uiux/source-3/01.png", alt: "Business proposal page designs on a yellow layout board", label: "Proposal pages" },
      { src: "assets/uiux/source-3/02.png", alt: "Business proposal layout variations", label: "Layout variations" },
      { src: "assets/uiux/source-3/03.png", alt: "Additional business proposal page concepts", label: "Page concepts" },
      { src: "assets/uiux/source-3/04.png", alt: "Business proposal component and page layouts", label: "Page details" },
      { src: "assets/uiux/source-3/05.png", alt: "Additional digital layout studies", label: "Visual studies" },
    ],
  },
];
window.IPS_RENDER_PORTFOLIO_CARDS = function (container, projects, type) {
  if (!container) return;
  const escape = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  container.innerHTML = projects.length ? projects.map((project, index) => `<article class="portfolio3d-card reveal">
    <button class="portfolio3d-card__preview" type="button" data-portfolio-index="${index}" aria-label="View ${escape(project.title)} project"><span class="portfolio3d-card__media"><img src="${escape(project.image)}" alt="${escape(project.imageAlt || project.title)}" loading="lazy" decoding="async" /><span class="portfolio3d-card__index">${escape(type.toUpperCase())} / ${String(index + 1).padStart(2, "0")}</span></span></button>
    <div class="portfolio3d-card__body"><span class="portfolio3d-card__copy"><strong>${escape(project.title)}</strong><small>${escape(project.category)}</small><small class="portfolio3d-card__artist">${escape(project.artist || "IPS Studio")}</small></span><button class="portfolio3d-card__cta" type="button" data-portfolio-index="${index}">VIEW PROJECT <span aria-hidden="true">&#8594;</span></button></div>
  </article>`).join("") : `<div class="portfolio-empty"><span class="portfolio-empty__index">${escape(type.toUpperCase())} / PORTFOLIO</span><div><p class="eyebrow"><span class="eyebrow-dash"></span> ${escape(type)} portfolio</p><p>Project previews are not available yet. Contact IPS Studio to discuss a ${escape(type.toLowerCase())} project.</p><a class="text-link" href="#contact">Discuss a project <span aria-hidden="true">&#8594;</span></a></div></div>`;
  container.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-portfolio-index]");
    if (!trigger) return;
    const project = projects[Number(trigger.dataset.portfolioIndex)];
    if (project) {
      const images = project.images?.length ? project.images : [{ src: project.image, alt: project.imageAlt || project.title, label: "Project image" }];
      window.IPS_PROJECT_MODAL.open({ ...project, images, type, artist: project.artist || "IPS Studio", details: { ...project.details, Artist: project.artist || "IPS Studio", Source: project.source || "IPS Studio portfolio" } }, { portfolio: `${type} Portfolio` });
    }
  });
};
