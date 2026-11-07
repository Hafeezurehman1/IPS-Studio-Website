/* Homepage interactions and shared service rendering. */
function initContactForm() {
  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#contact-form-status");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const name = String(values.get("name") || "").trim();
    const email = String(values.get("email") || "").trim();
    const service = String(values.get("service") || "").trim();
    const message = String(values.get("message") || "").trim();
    if (!name || !email || !service || !message) {
      if (status) status.textContent = "Please complete each field before sending.";
      return;
    }
    const subject = encodeURIComponent(`${service} inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nService: ${service}\n\nProject details:\n${message}`);
    if (status) status.textContent = "Your email app will open with the inquiry details ready to send.";
    window.location.href = `mailto:hello.ipsstudio@gmail.com?subject=${subject}&body=${body}`;
  });
}

const year = document.querySelector("#current-year");
if (year) year.textContent = String(new Date().getFullYear());

document.querySelectorAll("[data-highlight-value]").forEach((element) => {
  const key = element.dataset.highlightValue;
  const values = {
    team: window.IPS_TEAM?.length || 0,
    disciplines: window.IPS_SERVICES?.length || 0,
  };
  if (values[key] !== undefined) element.textContent = String(values[key]).padStart(2, "0");
});

window.IPS_RENDER_SERVICES?.(document.querySelector("#services-grid"), "home");
initContactForm();
window.IPS_OBSERVE_REVEALS?.();
