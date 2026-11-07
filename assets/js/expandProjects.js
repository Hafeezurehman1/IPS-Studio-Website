(() => {
  const initialCount = 6;
  const pages = [
    { grid: "games-page-grid", button: "games-page-expand", filters: "games-page-filters" },
    { grid: "modeling-page-grid", button: "modeling-page-expand" },
    { grid: "animation-page-grid", button: "animation-page-expand" },
  ];
  const config = pages.find(({ grid }) => document.getElementById(grid));
  if (!config) return;

  const grid = document.getElementById(config.grid);
  const button = document.getElementById(config.button);
  const label = button?.querySelector("[data-expansion-label]");
  const arrow = button?.querySelector(".project-expansion-toggle__arrow");
  const filterGroup = config.filters ? document.getElementById(config.filters) : null;
  const status = config.filters ? document.getElementById("games-page-status") : null;
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  let expanded = false;

  if (!grid || !button || !label) return;

  const getCards = () => [...grid.children].filter((card) => card.matches(".game-card, .portfolio3d-card, .animation-page-card"));
  const cancelCardAnimations = (card) => card.getAnimations?.().forEach((animation) => animation.cancel());
  const animateCard = (card, hide, delay = 0) => {
    cancelCardAnimations(card);
    if (reducedMotion || typeof card.animate !== "function") {
      card.hidden = hide;
      return;
    }

    if (!hide) card.hidden = false;
    const animation = card.animate(
      hide
        ? [{ opacity: 1, transform: "translateY(0)" }, { opacity: 0, transform: "translateY(12px)" }]
        : [{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: hide ? 190 : 300, delay, easing: "cubic-bezier(.2,.72,.22,1)", fill: "both" },
    );
    animation.addEventListener("finish", () => {
      if (hide) card.hidden = true;
      animation.cancel();
    }, { once: true });
  };

  const syncGameStatus = (cards) => {
    if (!status) return;
    const activeFilter = filterGroup?.querySelector("[aria-pressed='true']");
    const filterId = activeFilter?.dataset.gamesPageFilter;
    const category = filterId && filterId !== "all"
      ? `${activeFilter.textContent.trim().toLowerCase()} games`
      : "published games";
    const visibleCount = expanded ? cards.length : Math.min(initialCount, cards.length);
    status.textContent = `Showing ${visibleCount} of ${cards.length} ${category}.`;
  };

  const refresh = (animate = false) => {
    const cards = getCards();
    cards.forEach((card) => card.classList.add("project-expansion-card"));
    if (cards.length <= initialCount) expanded = false;
    button.hidden = cards.length <= initialCount;
    label.textContent = expanded ? "Show Less" : "Explore More";
    if (arrow) arrow.textContent = expanded ? "↑" : "↓";
    button.setAttribute("aria-expanded", String(expanded));

    cards.forEach((card, index) => {
      const hide = !expanded && index >= initialCount;
      if (card.hidden === hide) return;
      if (!animate) card.hidden = hide;
      else animateCard(card, hide, hide ? (index - initialCount) * 18 : (index - initialCount) * 42);
    });
    syncGameStatus(cards);
  };

  button.addEventListener("click", () => {
    expanded = !expanded;
    refresh(true);
  });

  filterGroup?.addEventListener("click", (event) => {
    if (!event.target.closest("[data-games-page-filter]")) return;
    expanded = false;
    window.queueMicrotask ? window.queueMicrotask(() => refresh(false)) : Promise.resolve().then(() => refresh(false));
  });

  refresh(false);
  if ("MutationObserver" in window) {
    new MutationObserver(() => refresh(false)).observe(grid, { childList: true });
  }
})();
