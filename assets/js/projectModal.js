(() => {
  const escape = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  const page = document.body.dataset.page || "home";
  const nested = page !== "home";
  const asset = (value = "") => `${nested ? "../" : "./"}${String(value).replace(/^\.\//, "")}`;
  const contactHref = nested ? "../index.html#contact" : "#contact";
  const dialog = document.createElement("dialog");
  dialog.className = "portfolio3d-dialog project-modal";
  dialog.id = "ips-project-modal";
  dialog.setAttribute("aria-labelledby", "ips-project-modal-title");
  dialog.setAttribute("aria-describedby", "ips-project-modal-description");
  dialog.setAttribute("aria-modal", "true");
  dialog.innerHTML = `<div class="portfolio3d-dialog__shell"><button class="portfolio3d-dialog__close" type="button" aria-label="Close project details">×</button><div class="portfolio3d-dialog__layout"><div class="portfolio3d-dialog__visual"><div class="project-modal__stage" role="group" aria-label="Project media preview" aria-live="polite"></div><div class="project-modal__navigation" aria-label="Project image controls" hidden><button type="button" data-media-step="-1" aria-label="Show previous project image">PREVIOUS</button><button type="button" data-media-step="1" aria-label="Show next project image">NEXT</button></div><div class="portfolio3d-dialog__gallery" role="group" aria-label="Project media gallery"></div></div><div class="portfolio3d-dialog__copy"><p class="eyebrow"><span class="eyebrow-dash"></span> <span class="project-modal__eyebrow">IPS Studio / Portfolio</span></p><h2 id="ips-project-modal-title"></h2><p class="portfolio3d-dialog__category"></p><p class="portfolio3d-dialog__description" id="ips-project-modal-description"></p><dl class="project-modal__details"></dl><a class="button button--primary" href="${contactHref}">Discuss a similar project <span aria-hidden="true">→</span></a></div></div></div>`;
  document.body.append(dialog);
  const stage = dialog.querySelector(".project-modal__stage");
  const gallery = dialog.querySelector(".portfolio3d-dialog__gallery");
  const navigation = dialog.querySelector(".project-modal__navigation");
  let activeVideo = null;
  let activeImageIndex = 0;

  const stopMedia = () => {
    if (activeVideo) {
      activeVideo.pause();
      activeVideo.removeAttribute("src");
      activeVideo.load();
      activeVideo = null;
    }
  };
  const setImage = (image) => {
    stopMedia();
    const element = document.createElement("img");
    element.className = "portfolio3d-dialog__image";
    element.src = asset(image.src);
    element.alt = image.alt || image.label || "Project image";
    element.decoding = "async";
    stage.replaceChildren(element);
  };
  const setVideo = (project) => {
    stopMedia();
    const video = document.createElement("video");
    video.className = "portfolio3d-dialog__image project-modal__video";
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.muted = true;
    video.poster = asset(project.poster || project.images?.[0]?.src || "");
    video.setAttribute("aria-label", `${project.title} animation preview`);
    let playbackStarted = false;
    const startPlayback = () => {
      if (playbackStarted) return;
      playbackStarted = true;
      const playbackStart = Number(project.playbackStart) || 0;
      if (playbackStart > 0 && Number.isFinite(video.duration) && playbackStart < video.duration) {
        video.addEventListener("seeked", () => video.play().catch(() => {}), { once: true });
        video.currentTime = playbackStart;
        return;
      }
      video.play().catch(() => {});
    };
    video.addEventListener("loadedmetadata", startPlayback, { once: true });
    video.src = asset(project.video);
    activeVideo = video;
    stage.replaceChildren(video);
    if (video.readyState >= 1) startPlayback();
  };

  window.IPS_PROJECT_MODAL = {
    open(project, { portfolio = "3D Portfolio" } = {}) {
      if (!project) return;
      stopMedia();
      project = { ...project, artist: project.suppressCreatorDisplay ? "" : "IPS Studio" };
      this.currentProject = project;
      const images = Array.isArray(project.images) ? project.images : [];
      activeImageIndex = 0;
      navigation.hidden = images.length < 2;
      dialog.querySelector("#ips-project-modal-title").textContent = project.title || "";
      dialog.querySelector(".portfolio3d-dialog__category").textContent = project.category || "";
      dialog.querySelector(".portfolio3d-dialog__description").textContent = project.description || "";
      dialog.querySelector(".project-modal__eyebrow").textContent = `IPS Studio / ${portfolio}`;
      const detailValues = { ...(project.details && typeof project.details === "object" ? project.details : {}) };
      if (project.suppressCreatorDisplay) delete detailValues.Artist;
      else if (!detailValues.Artist) detailValues.Artist = "IPS Studio";
      if (!project.sourceInternalOnly && !detailValues.Source) detailValues.Source = project.source || "IPS Studio portfolio";
      const details = Object.entries(detailValues).filter(([, value]) => value);
      dialog.querySelector(".project-modal__details").innerHTML = details.map(([label, value]) => `<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`).join("");
      gallery.innerHTML = images.map((image, index) => `<button class="portfolio3d-dialog__thumb" type="button" data-media-index="${index}" aria-label="Show ${escape(image.label || `image ${index + 1}`)}" aria-pressed="${index === 0 && !project.video}"><img src="${escape(asset(image.src))}" alt="" loading="lazy" decoding="async" /><span>${escape(image.label || `Image ${index + 1}`)}</span></button>`).join("");
      if (project.video) {
        const videoThumb = document.createElement("button");
        videoThumb.type = "button";
        videoThumb.className = "portfolio3d-dialog__thumb";
        videoThumb.dataset.videoPreview = "true";
        videoThumb.setAttribute("aria-label", `Play ${project.title} animation`);
        videoThumb.setAttribute("aria-pressed", "true");
        videoThumb.innerHTML = `<img src="${escape(asset(project.poster || images[0]?.src || ""))}" alt="" loading="lazy" decoding="async" /><span>Video preview</span>`;
        gallery.prepend(videoThumb);
        setVideo(project);
      } else if (images[0]) setImage(images[0]);
      else stage.replaceChildren();
      if (!dialog.open) dialog.showModal();
    },
    close() { if (dialog.open) dialog.close(); },
  };

  gallery.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const project = window.IPS_PROJECT_MODAL.currentProject;
    if (button.dataset.videoPreview) {
      button.setAttribute("aria-pressed", "true");
      setVideo(project);
      gallery.querySelectorAll("button:not([data-video-preview])").forEach((item) => item.setAttribute("aria-pressed", "false"));
      return;
    }
    const image = project?.images?.[Number(button.dataset.mediaIndex)];
    if (!image) return;
    activeImageIndex = Number(button.dataset.mediaIndex);
    gallery.querySelectorAll("button").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    setImage(image);
  });
  navigation.addEventListener("click", (event) => {
    const button = event.target.closest("[data-media-step]");
    const images = window.IPS_PROJECT_MODAL.currentProject?.images || [];
    if (!button || images.length < 2) return;
    activeImageIndex = (activeImageIndex + Number(button.dataset.mediaStep) + images.length) % images.length;
    gallery.querySelectorAll("button:not([data-video-preview])").forEach((item, index) => item.setAttribute("aria-pressed", String(index === activeImageIndex)));
    setImage(images[activeImageIndex]);
  });
  dialog.querySelector(".portfolio3d-dialog__close").addEventListener("click", () => dialog.close());
  dialog.querySelector(".portfolio3d-dialog__copy .button").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("keydown", (event) => {
    const images = window.IPS_PROJECT_MODAL.currentProject?.images || [];
    if (!dialog.open || images.length < 2 || event.target.closest("input, textarea, select, video, [contenteditable='true']")) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const step = event.key === "ArrowRight" ? 1 : -1;
    activeImageIndex = (activeImageIndex + step + images.length) % images.length;
    gallery.querySelectorAll("button:not([data-video-preview])").forEach((item, index) => item.setAttribute("aria-pressed", String(index === activeImageIndex)));
    setImage(images[activeImageIndex]);
  });
  dialog.addEventListener("close", stopMedia);
})();
