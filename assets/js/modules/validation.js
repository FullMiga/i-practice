import { onlyNumbers } from "./formatters.js";

function isCpfValid(value) {
  const numbers = onlyNumbers(value, 11);

  if (numbers.length !== 11 || /^(\d)\1{10}$/.test(numbers)) return false;

  const calculateDigit = (length) => {
    const sum = Array.from(
      { length },
      (_, index) => Number(numbers[index]) * (length + 1 - index),
    ).reduce((total, value) => total + value, 0);
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return (
    calculateDigit(9) === Number(numbers[9]) &&
    calculateDigit(10) === Number(numbers[10])
  );
}

function setCustomValidation(field) {
  field.setCustomValidity("");
  const value = field.value.trim();

  if (
    field.required &&
    value === "" &&
    !field.matches('[type="radio"], [type="checkbox"]')
  ) {
    field.setCustomValidity("Este campo é obrigatório.");
  } else if (field.id === "nome" && value.length < 3) {
    field.setCustomValidity("Informe seu nome completo.");
  } else if (field.id === "cpf" && value && !isCpfValid(value)) {
    field.setCustomValidity("Informe um CPF válido.");
  }
}

function getErrorMessage(field) {
  const { validity } = field;

  if (validity.valid) return "";
  if (validity.customError) return field.validationMessage;
  if (validity.valueMissing) return "Este campo é obrigatório.";
  if (validity.typeMismatch) return "Informe um e-mail válido.";
  if (validity.tooShort) return `Use pelo menos ${field.minLength} caracteres.`;
  if (validity.tooLong) return `Use no máximo ${field.maxLength} caracteres.`;
  if (validity.rangeUnderflow)
    return `O valor mínimo permitido é ${field.min}.`;
  if (validity.rangeOverflow) return `O valor máximo permitido é ${field.max}.`;

  if (validity.patternMismatch) {
    const messages = {
      cpf: "Use o formato 000.000.000-00.",
      telefone: "Informe o DDD e um telefone válido.",
      cep: "Use o formato 00000-000.",
    };
    return messages[field.id] ?? "Revise o formato informado.";
  }

  return "Revise o valor informado.";
}

function getValidationTarget(field) {
  if (field.type !== "radio") return field;

  const group = field.form.elements.namedItem(field.name);
  return Array.from(group).find((option) => option.required) ?? field;
}

function updateFieldMessage(field, message) {
  if (!field.id) return;

  const messageId = `${field.id}-erro`;
  let element = document.getElementById(messageId);
  const describedBy = new Set(
    (field.getAttribute("aria-describedby") ?? "").split(" ").filter(Boolean),
  );

  if (!message) {
    element?.remove();
    describedBy.delete(messageId);
  } else {
    if (!element) {
      element = document.createElement("small");
      element.id = messageId;
      element.className = "field-message";
      element.setAttribute("role", "alert");
      field.insertAdjacentElement("afterend", element);
    }
    element.textContent = message;
    describedBy.add(messageId);
  }

  if (describedBy.size > 0) {
    field.setAttribute("aria-describedby", Array.from(describedBy).join(" "));
  } else {
    field.removeAttribute("aria-describedby");
  }
}

export function updateFieldState(field) {
  if (!field.matches("input, select, textarea")) return;

  const target = getValidationTarget(field);
  setCustomValidation(target);
  const isTextControl = target.matches(
    'input:not([type="radio"], [type="checkbox"]), select, textarea',
  );
  const hasValue = target.value.trim() !== "";
  const isValid = target.checkValidity();

  if (isTextControl) {
    target.classList.toggle("is-valid", hasValue && isValid);
    target.classList.toggle("is-invalid", !isValid);
  }

  if (isValid) {
    target.removeAttribute("aria-invalid");
    updateFieldMessage(target, "");
  } else {
    target.setAttribute("aria-invalid", "true");
    updateFieldMessage(target, getErrorMessage(target));
  }
}
