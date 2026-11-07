window.IPS_RENDER_GAME_CARDS = function (container, entries, { nested = false, featuredId = window.IPS_FEATURED_GAME_ID, append = false, reveal = false } = {}) {
  if (!container) return;
  const escape = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  const asset = (value = "") => `${nested ? "../" : "./"}${value.replace(/^\.\//, "")}`;
  const markup = entries.map((game, index) => {
    const featured = game.id === featuredId;
    return `<a class="game-card game-card--catalog reveal${featured ? " is-featured" : ""}${reveal ? " game-card--reveal" : ""}" style="--reveal-index:${index}" data-game-id="${escape(game.id)}" href="${escape(game.playStoreUrl)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(game.title)} — view on Google Play">
      <span class="game-card__visual"><img class="game-card__image" src="${escape(asset(game.image))}" alt="${escape(game.title)} gameplay screenshot" loading="lazy" decoding="async" />${featured ? '<span class="game-card__badge">FEATURED</span>' : ""}</span>
      <span class="game-card__content"><img class="game-card__icon" src="${escape(asset(game.icon))}" alt="" loading="lazy" decoding="async" /><span class="game-card__details"><strong>${escape(game.title)}</strong><small>${escape(game.genre || "Genre not listed")}</small><span class="game-card__link">PLAY NOW <span aria-hidden="true">&#8594;</span></span></span></span>
    </a>`;
  }).join("");
  if (append) container.insertAdjacentHTML("beforeend", markup);
  else container.innerHTML = markup;
  window.IPS_OBSERVE_REVEALS?.(container);
};
