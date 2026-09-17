export function showToast(title, message, type = "success") {
  document.querySelector(".toast")?.remove();

  const toast = document.createElement("aside");
  const icon = document.createElement("span");
  const content = document.createElement("span");
  const heading = document.createElement("strong");
  const description = document.createElement("p");
  const closeButton = document.createElement("button");

  toast.className = `toast ${type}`;
  toast.setAttribute("role", type === "error" ? "alert" : "status");
  toast.setAttribute("aria-live", type === "error" ? "assertive" : "polite");
  icon.className = "icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = type === "error" ? "!" : "OK";
  content.className = "content";
  heading.textContent = title;
  description.textContent = message;
  closeButton.className = "close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Fechar notificação");
  closeButton.textContent = "x";
  closeButton.addEventListener("click", () => toast.remove());

  content.append(heading, description);
  toast.append(icon, content, closeButton);
  document.body.append(toast);

  if (type !== "error") setTimeout(() => toast.remove(), 4000);
}
