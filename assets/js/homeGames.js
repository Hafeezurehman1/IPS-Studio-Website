(() => {
  const games = window.IPS_GAMES || [];
  const filtersRoot = document.querySelector("#home-games-filters");
  const grid = document.querySelector("#home-games-grid");
  const status = document.querySelector("#home-games-status");
  const count = document.querySelector("#home-games-count");
  if (!filtersRoot || !grid || typeof window.IPS_RENDER_GAME_CARDS !== "function") return;

  const categories = [
    { id: "all", label: "All Games", test: () => true },
    { id: "casual", label: "Casual", test: (game) => /casual/i.test(game.genre || "") },
    { id: "puzzle", label: "Puzzle", test: (game) => /puzzle/i.test(game.genre || "") },
    { id: "simulation", label: "Simulation", test: (game) => /simulation/i.test(game.genre || "") },
    { id: "action", label: "Action", test: (game) => /action/i.test(game.genre || "") },
  ].filter((category) => category.id === "all" || games.some(category.test));
  let active = "all";

  const escape = (value = "") => String(value).replace(/[&<>\"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '\"': "&quot;", "'": "&#39;" }[character]));
  filtersRoot.innerHTML = categories.map((category) => `<button class="home-games__filter${category.id === "all" ? " is-active" : ""}" type="button" data-home-game-filter="${category.id}" aria-pressed="${category.id === "all"}">${escape(category.label)}</button>`).join("");
  if (count) count.textContent = `${games.length} titles in this catalog`;

  const render = (animate = true) => {
    const category = categories.find((item) => item.id === active) || categories[0];
    const matching = games.filter(category.test);
    const visible = matching.slice(0, 6);
    window.IPS_RENDER_GAME_CARDS(grid, visible, { reveal: animate });
    filtersRoot.querySelectorAll("[data-home-game-filter]").forEach((button) => {
      const selected = button.dataset.homeGameFilter === active;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    if (status) status.textContent = `Showing ${visible.length} of ${matching.length} ${category.label.toLowerCase()} ${matching.length === 1 ? "title" : "titles"}.`;
  };

  filtersRoot.addEventListener("click", (event) => {
    const button = event.target.closest("[data-home-game-filter]");
    if (!button) return;
    active = button.dataset.homeGameFilter;
    render();
  });
  render(false);
})();
