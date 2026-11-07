(() => {
  const page = document.body.dataset.page || "home";
  const rootPage = page === "home" || page === "portfolio";
  const year = document.querySelector("#current-year");
  if (year) year.textContent = String(new Date().getFullYear());
  const wrapHeadingWords = (heading) => {
    if (heading.dataset.wordRevealReady) return;
    heading.dataset.wordRevealReady = "true";
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      const textNode = walker.currentNode;
      if (!textNode.nodeValue.trim()) continue;
      const parentStyle = window.getComputedStyle(textNode.parentElement);
      if (parentStyle.backgroundClip === "text" || parentStyle.webkitBackgroundClip === "text") continue;
      nodes.push(textNode);
    }
    let wordIndex = 0;
    nodes.forEach((textNode) => {
      const fragment = document.createDocumentFragment();
      textNode.nodeValue.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          fragment.append(document.createTextNode(part));
          return;
        }
        const word = document.createElement("span");
        word.className = "reveal-word";
        word.style.setProperty("--word-index", String(wordIndex++));
        word.textContent = part;
        fragment.append(word);
      });
      textNode.replaceWith(fragment);
    });
  };
  document.querySelectorAll("main h1, main h2").forEach(wrapHeadingWords);
  document.querySelectorAll("main > section .section-heading, main > section .dev-page-cta__inner, main > section .catalog-page-hero__content > h1, main > section .catalog-page-hero__content > p:not(.eyebrow), main > section .section-heading__aside > p").forEach((textBlock) => textBlock.classList.add("reveal"));
  const footer = document.querySelector(".footer__main");
  if (footer) {
    const home = rootPage ? "./index.html" : "../index.html";
    const root = rootPage ? "./" : "../";
    footer.innerHTML = `
      <div class="footer__brand">
        <a class="brand" href="${home}#home" aria-label="IPS Studio home"><span class="brand__mark" aria-hidden="true"><span></span><span></span><span></span><span></span></span><span class="brand__wordmark"><strong>IPS</strong><small>STUDIO</small></span></a>
        <p>Creative and digital<br />production studio.</p>
        <div class="footer__social"><a href="https://www.instagram.com/infinite_pixel_studioo/?hl=en" target="_blank" rel="noopener noreferrer">Instagram <span aria-hidden="true">&#8599;</span></a><a href="https://www.upwork.com/freelancers/~01aab852ac1d6a9ca4" target="_blank" rel="noopener noreferrer">Upwork <span aria-hidden="true">&#8599;</span></a></div>
      </div>
      <div class="footer__column"><h2>Navigate</h2><a href="${home}#home">Home</a><a href="${root}games/index.html">Games</a><a href="${root}portfolio.html">Selected Work</a><a href="${root}3d-modeling/index.html">3D Modeling</a><a href="${root}animation/index.html">Animation</a><a href="${root}services/index.html">Services</a><a href="${root}about/index.html">About</a></div>
      <div class="footer__column"><h2>Capabilities</h2><a href="${root}game-development/index.html">Game Development</a><a href="${root}3d-modeling/index.html">CAD / Product Modeling</a><a href="${root}animation/index.html">3D Animation</a><a href="${root}portfolio.html?portfolio=game-art#portfolio">Game Art</a><a href="${root}portfolio.html?portfolio=ui-ux-design#portfolio">UI/UX Design</a><a href="${root}services/index.html">Marketing &amp; ASO</a></div>
      <div class="footer__column footer__contact"><h2>Contact</h2><span>Lahore, Punjab, Pakistan</span><a href="tel:+923704242089">+923704242089</a><a href="mailto:hello.ipsstudio@gmail.com">hello.ipsstudio@gmail.com</a><a href="${home}#contact">Start a project <span aria-hidden="true">&#8599;</span></a></div>`;
  }
  window.IPS_OBSERVE_REVEALS = (root = document) => {
    const pending = [...root.querySelectorAll(".reveal:not([data-observed])")];
    if (!pending.length) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      pending.forEach((element) => {
        element.dataset.observed = "true";
        element.classList.add("is-visible");
      });
      return;
    }
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        activeObserver.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: "0px 0px -24px 0px" });
    pending.forEach((element) => {
      element.dataset.observed = "true";
      observer.observe(element);
    });
  };
  window.IPS_OBSERVE_REVEALS();

  const header = document.querySelector("#site-header");
  const nav = document.querySelector("#main-nav");
  const toggle = document.querySelector(".menu-toggle");
  if (!header || !nav || !toggle) return;
  const navLinks = [...nav.querySelectorAll("a")];
  const closeMenu = ({ restoreFocus = false } = {}) => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");
    document.body.classList.remove("menu-open");
    if (restoreFocus) toggle.focus();
  };
  const syncHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    if (open) requestAnimationFrame(() => navLinks[0]?.focus());
  });
  navLinks.forEach((link) => link.addEventListener("click", () => closeMenu()));
  document.addEventListener("pointerdown", (event) => {
    if (toggle.getAttribute("aria-expanded") === "true" && !nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") closeMenu({ restoreFocus: true });
  });
  window.matchMedia("(min-width: 961px)").addEventListener?.("change", (event) => {
    if (event.matches) closeMenu();
  });
  window.addEventListener("scroll", syncHeader, { passive: true });
  syncHeader();

  const navigationLinks = [...nav.querySelectorAll("a")];
  const activate = (activeLink) => {
    navigationLinks.forEach((link) => {
      const isActive = link === activeLink;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  };
  if (page !== "home") {
    const activePage = page === "game-development" ? "games" : page;
    activate(nav.querySelector(`[data-page-link="${activePage}"]`) || null);
    return;
  }

  const activateSection = (sectionId) => {
    const pageLinks = {
      "studio-highlights": "home",
      "studio-intro": "home",
      "client-feedback": "services",
      "why-work": "services",
      "our-team": "about",
      contact: "home",
    };
    const pageLink = pageLinks[sectionId] || sectionId;
    activate(nav.querySelector(`[data-page-link="${pageLink}"]`) || null);
  };
  const sections = [...document.querySelectorAll("main > section[id]")];
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) activateSection(visible.target.id);
    }, { rootMargin: "-28% 0px -58% 0px", threshold: [0, .1, .25, .5] });
    sections.forEach((section) => sectionObserver.observe(section));
  }
  activateSection(location.hash.replace(/^#/, "") || "home");
})();
