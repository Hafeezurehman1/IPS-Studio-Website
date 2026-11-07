window.IPS_RENDER_SERVICES(document.querySelector("#services-page-grid"), "page");
document.querySelector("#current-year").textContent = String(new Date().getFullYear());
window.IPS_OBSERVE_REVEALS?.();
