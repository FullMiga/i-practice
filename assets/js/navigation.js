import { showToast } from "./modules/feedback.js";

const header = document.querySelector(".home .header");
const menuButton = document.querySelector(".home .menu");
const dropdown = document.querySelector(".home .nav .item");
const dropdownButton = document.querySelector(".home .dropbtn");
const app = document.querySelector("#app");
const mobileViewport = window.matchMedia("(max-width: 767px)");
const pages = new Set(["index.html", "projetos.html", "cadastro.html"]);
let navigationId = 0;
let activeRequest;
let lastSuccessfulUrl = window.location.href;

function closeDropdown() {
  dropdown.classList.remove("open");
  dropdownButton.setAttribute("aria-expanded", "false");
}

function closeMenu() {
  header.classList.remove("menu-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menu principal");
  closeDropdown();
}

function getPageName(url) {
  const pageName = url.pathname.split("/").at(-1);
  return pageName?.includes(".") ? pageName : "index.html";
}

function renderContent(source) {
  const fragment = document.createDocumentFragment();

  Array.from(source.childNodes).forEach((node) => {
    fragment.append(document.importNode(node, true));
  });

  app.replaceChildren(fragment);
}

function updateCurrentPage(url) {
  document
    .querySelectorAll(".nav [aria-current], .footnav [aria-current]")
    .forEach((element) => element.removeAttribute("aria-current"));

  const pageName = getPageName(url);
  const selectors = {
    "index.html": [
      '.nav a[href="index.html"]',
      '.footnav a[href="index.html"]',
    ],
    "projetos.html": [
      ".nav .dropbtn",
      '.nav .submenu a[href="projetos.html"]',
      '.footnav a[href="projetos.html"]',
    ],
    "cadastro.html": [
      '.nav .button[href="cadastro.html"]',
      '.footnav a[href="cadastro.html"]',
    ],
  };

  selectors[pageName]?.forEach((selector) => {
    document.querySelector(selector)?.setAttribute("aria-current", "page");
  });
}

function restoreScroll(url) {
  const targetId = decodeURIComponent(url.hash.slice(1));
  const target = targetId ? document.getElementById(targetId) : null;

  if (target) {
    target.scrollIntoView();
    return;
  }

  window.scrollTo({ top: 0, behavior: "auto" });
}

async function navigate(url, pushState = true) {
  activeRequest?.abort();
  const controller = new AbortController();
  activeRequest = controller;
  const currentNavigation = ++navigationId;
  app.setAttribute("aria-busy", "true");

  try {
    const response = await fetch(url, {
      headers: { "X-Requested-With": "spa-navigation" },
      signal: controller.signal,
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const html = await response.text();
    const nextDocument = new DOMParser().parseFromString(html, "text/html");
    const nextContent = nextDocument.querySelector("#app");

    if (!nextContent) throw new Error("Container #app não encontrado.");
    if (currentNavigation !== navigationId) return;

    renderContent(nextContent);
    document.querySelector(".toast")?.remove();
    document.title = nextDocument.title;
    document.body.className = nextDocument.body.className;
    updateCurrentPage(url);
    closeMenu();

    if (pushState) history.pushState({ spa: true }, "", url);
    lastSuccessfulUrl = url.href;

    app.setAttribute("tabindex", "-1");
    app.focus({ preventScroll: true });
    app.removeAttribute("tabindex");
    restoreScroll(url);
    document.dispatchEvent(
      new CustomEvent("spa:render", { detail: { url: url.href } }),
    );
  } catch (error) {
    if (error.name === "AbortError") return;
    if (!pushState) history.replaceState({ spa: true }, "", lastSuccessfulUrl);
    showToast(
      "Não foi possível carregar a página",
      navigator.onLine
        ? "A navegação falhou. Verifique o endereço e tente novamente."
        : "Você parece estar sem conexão. Tente novamente quando a rede voltar.",
      "error",
    );
  } finally {
    if (activeRequest === controller) activeRequest = null;
    if (currentNavigation === navigationId) {
      app.removeAttribute("aria-busy");
    }
  }
}

menuButton.addEventListener("click", () => {
  const isOpen = header.classList.toggle("menu-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute(
    "aria-label",
    isOpen ? "Fechar menu principal" : "Abrir menu principal",
  );
});

dropdownButton.addEventListener("click", () => {
  const isOpen = dropdown.classList.toggle("open");
  dropdownButton.setAttribute("aria-expanded", String(isOpen));
});

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href]");

  if (
    link &&
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey &&
    !link.hasAttribute("download") &&
    link.target !== "_blank"
  ) {
    const url = new URL(link.href, window.location.href);
    const sameDocument =
      url.pathname === window.location.pathname && url.hash !== "";

    if (
      url.origin === window.location.origin &&
      pages.has(getPageName(url)) &&
      !sameDocument
    ) {
      event.preventDefault();
      navigate(url);
      return;
    }
  }

  if (!header.contains(event.target)) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    menuButton.focus();
  }
});

mobileViewport.addEventListener("change", closeMenu);
window.addEventListener("popstate", () =>
  navigate(new URL(window.location.href), false),
);
history.replaceState({ spa: true }, "", window.location.href);
