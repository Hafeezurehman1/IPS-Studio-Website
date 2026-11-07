window.IPS_TEAM = [
  { number: "01", name: "Hafeez", role: "Cofounder & CEO", image: "team-ceo.webp" },
  { number: "02", name: "Umair Afzal", role: "Cofounder & CTO", image: "team-aso.png" },
  { number: "03", name: "Muzamil Fareed", role: "Web Developer", image: "team-web-dev.png" },
  { number: "04", name: "Waleed Ahmed", role: "App Developer", image: "team-app-dev.png" },
  { number: "05", name: "Rao Ahmed", role: "Game Developer", image: "team-game-dev.png" },
  { number: "06", name: "Umer Farooq", role: "Graphic Designer", image: "team-graphic-designer.png" },
  { number: "07", name: "Niaz Ahmed", role: "SEO Specialist", image: "team-seo.png" },
  { number: "08", name: "Arsal Rehman", role: "QA Engineer", image: "team-qa.png" },
];

window.IPS_RENDER_TEAM = function (container) {
  if (!container) return;
  const escape = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  const assetPrefix = document.body.dataset.page === "home" ? "./" : "../";
  container.innerHTML = window.IPS_TEAM.map((member, index) => {
    return `<article class="team-card reveal" data-team-card role="listitem" tabindex="0" style="--team-index:${index}"><span class="team-card__number">${escape(member.number)}</span><div class="team-card__content"><img class="team-card__portrait" src="${assetPrefix}assets/team/source/${escape(member.image)}" alt="${escape(member.name)}, ${escape(member.role)}" loading="lazy" decoding="async" /><h3>${escape(member.name)}</h3><p>${escape(member.role)}</p></div></article>`;
  }).join("");
  window.IPS_OBSERVE_REVEALS?.(container);

  const finePointer = window.matchMedia?.("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  if (!finePointer?.matches || reducedMotion?.matches) return;

  container.querySelectorAll("[data-team-card]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (reducedMotion?.matches || (event.pointerType && event.pointerType !== "mouse")) return;
      const bounds = card.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
      const y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
      card.style.setProperty("--team-rotate-x", `${((0.5 - y) * 5).toFixed(2)}deg`);
      card.style.setProperty("--team-rotate-y", `${((x - 0.5) * 6).toFixed(2)}deg`);
      card.style.setProperty("--team-lift", "-5px");
      card.style.setProperty("--team-glow-x", `${(x * 100).toFixed(1)}%`);
      card.style.setProperty("--team-glow-y", `${(y * 100).toFixed(1)}%`);
    });
    const resetTilt = () => {
      card.style.removeProperty("--team-rotate-x");
      card.style.removeProperty("--team-rotate-y");
      card.style.removeProperty("--team-lift");
      card.style.removeProperty("--team-glow-x");
      card.style.removeProperty("--team-glow-y");
    };
    card.addEventListener("pointerleave", resetTilt);
    card.addEventListener("pointercancel", resetTilt);
  });
};

document.querySelectorAll("[data-team-grid]").forEach(window.IPS_RENDER_TEAM);
