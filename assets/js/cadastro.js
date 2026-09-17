import {
  clearDraft,
  restoreDraft,
  saveSubmission,
  scheduleDraft,
} from "./modules/form-persistence.js";
import { formatCep, formatCpf, formatPhone } from "./modules/formatters.js";
import { showToast } from "./modules/feedback.js";
import { updateFieldState } from "./modules/validation.js";

function clearFormState(form) {
  form.querySelectorAll("input, select, textarea").forEach((field) => {
    field.classList.remove("is-valid", "is-invalid");
    field.removeAttribute("aria-invalid");
    delete field.dataset.touched;
  });
  form
    .querySelectorAll(".field-message")
    .forEach((message) => message.remove());
}

function initializeCadastro() {
  const form = document.querySelector(
    '.signup-page form[action="cadastro.html"]',
  );
  const cpf = document.querySelector("#cpf");
  const telefone = document.querySelector("#telefone");
  const cep = document.querySelector("#cep");
  const nascimento = document.querySelector("#nascimento");

  if (!form || !cpf || form.dataset.initialized === "true") return;

  form.dataset.initialized = "true";
  nascimento.max = new Date().toISOString().split("T")[0];
  restoreDraft(form);

  cpf.addEventListener("input", () => {
    cpf.value = formatCpf(cpf.value);
    cpf.setCustomValidity("");
  });

  telefone.addEventListener("input", () => {
    telefone.value = formatPhone(telefone.value);
  });

  cep.addEventListener("input", () => {
    cep.value = formatCep(cep.value);
  });

  form.addEventListener("input", (event) => {
    if (event.target.dataset.touched === "true") {
      updateFieldState(event.target);
    }
    scheduleDraft(form);
  });

  form.addEventListener("change", (event) => {
    updateFieldState(event.target);
    scheduleDraft(form);
  });

  form.addEventListener(
    "blur",
    (event) => {
      event.target.dataset.touched = "true";
      updateFieldState(event.target);
    },
    true,
  );

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    form.querySelectorAll("input, select, textarea").forEach((field) => {
      field.dataset.touched = "true";
      updateFieldState(field);
    });

    if (!form.checkValidity()) {
      form.querySelector(":invalid")?.focus();
      form.reportValidity();
      showToast(
        "Revise o formulário",
        "Corrija os campos destacados antes de enviar.",
        "error",
      );
      return;
    }

    if (!saveSubmission(form)) {
      showToast(
        "Não foi possível salvar",
        "O armazenamento do navegador está indisponível. Seus dados foram mantidos no formulário.",
        "error",
      );
      return;
    }
    clearDraft();
    form.reset();
    clearFormState(form);
    showToast(
      "Cadastro enviado",
      "Seus dados foram validados e salvos neste navegador.",
    );
  });
}

document.addEventListener("spa:render", initializeCadastro);
initializeCadastro();
