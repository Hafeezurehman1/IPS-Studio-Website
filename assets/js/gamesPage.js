(() => {
  const games = window.IPS_GAMES || [];
  const grid = document.querySelector("#games-page-grid");
  const filtersRoot = document.querySelector("#games-page-filters");
  const status = document.querySelector("#games-page-status");
  const count = document.querySelector("#games-page-count");
  if (!grid || !filtersRoot || typeof window.IPS_RENDER_GAME_CARDS !== "function") return;

  const categories = [
    { id: "all", label: "All Games", test: () => true },
    { id: "casual", label: "Casual", test: (game) => /casual/i.test(game.genre || "") },
    { id: "puzzle", label: "Puzzle", test: (game) => /puzzle/i.test(game.genre || "") },
    { id: "simulation", label: "Simulation", test: (game) => /simulation/i.test(game.genre || "") },
    { id: "action", label: "Action", test: (game) => /action/i.test(game.genre || "") },
  ].filter((category) => category.id === "all" || games.some(category.test));
  let active = "all";
  const escape = (value = "") => String(value).replace(/[&<>\"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '\"': "&quot;", "'": "&#39;" }[character]));

  filtersRoot.innerHTML = categories.map((category) => `<button class="home-games__filter${category.id === "all" ? " is-active" : ""}" type="button" data-games-page-filter="${category.id}" aria-pressed="${category.id === "all"}">${escape(category.label)}</button>`).join("");
  if (count) count.textContent = `${games.length} published games`;

  const render = (animate = true) => {
    const category = categories.find((item) => item.id === active) || categories[0];
    const matching = games.filter(category.test);
    window.IPS_RENDER_GAME_CARDS(grid, matching, { nested: true, reveal: animate });
    filtersRoot.querySelectorAll("[data-games-page-filter]").forEach((button) => {
      const selected = button.dataset.gamesPageFilter === active;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    if (status) status.textContent = `${matching.length} ${category.id === "all" ? "published games" : `${category.label.toLowerCase()} games`} shown.`;
  };

  filtersRoot.addEventListener("click", (event) => {
    const button = event.target.closest("[data-games-page-filter]");
    if (!button) return;
    active = button.dataset.gamesPageFilter;
    render();
  });
  render(false);
})();
