(() => {
  const phrases = [
    "Creative Worlds. Endless Possibilities.",
    "From Ideas to Digital Experiences.",
    "Built with Creativity and Technology.",
    "Games That Inspire.",
  ];
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-typewriter]").forEach((element) => {
    const customPhrases = element.dataset.typewriterPhrases
      ?.split("|")
      .map((phrase) => phrase.trim())
      .filter(Boolean);
    const sequence = customPhrases?.length ? customPhrases : phrases;
    const startIndex = Number(element.dataset.typewriterStart || 0) % sequence.length;
    const typeOnce = element.dataset.typewriterOnce === "true";
    if (reduceMotion) {
      element.textContent = sequence[startIndex];
      return;
    }

    let phraseIndex = startIndex;
    let characterIndex = 0;
    const typeNext = () => {
      const phrase = sequence[phraseIndex];
      if (characterIndex < phrase.length) {
        characterIndex += 1;
        element.textContent = phrase.slice(0, characterIndex);
        window.setTimeout(typeNext, 38 + Math.random() * 22);
        return;
      }
      if (typeOnce) return;
      window.setTimeout(eraseNext, 1500);
    };
    const eraseNext = () => {
      if (characterIndex > 0) {
        characterIndex -= 1;
        element.textContent = sequence[phraseIndex].slice(0, characterIndex);
        window.setTimeout(eraseNext, 24 + Math.random() * 14);
        return;
      }
      phraseIndex = (phraseIndex + 1) % sequence.length;
      window.setTimeout(typeNext, 280);
    };

    element.textContent = "";
    typeNext();
  });

  document.querySelectorAll("[data-count-up]").forEach((counter) => {
    const target = Number(counter.dataset.countTo);
    const suffix = counter.dataset.countSuffix || "";
    const padWidth = Math.max(0, Math.floor(Number(counter.dataset.countPad) || 0));
    const formatCount = (value) => `${String(value).padStart(padWidth, "0")}${suffix}`;
    if (!Number.isFinite(target)) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      counter.textContent = formatCount(target);
      return;
    }

    let hasStarted = false;
    counter.textContent = formatCount(0);
    const observer = new IntersectionObserver((entries) => {
      if (hasStarted || !entries.some((entry) => entry.isIntersecting)) return;
      hasStarted = true;
      observer.disconnect();
      const startTime = performance.now();
      const duration = 1100;
      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        counter.textContent = formatCount(progress === 1 ? target : value);
        if (progress < 1) window.requestAnimationFrame(tick);
      };
      window.requestAnimationFrame(tick);
    }, { threshold: 0.35 });
    observer.observe(counter);
  });
})();
