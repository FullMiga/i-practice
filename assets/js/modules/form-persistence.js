import { readJson, removeItem, writeJson } from "./storage.js";

const draftKey = "horizonte-azul:cadastro:rascunho";
const submissionKey = "horizonte-azul:cadastro:envio";
const excludedFields = new Set(["cpf", "consentimento"]);
let saveTimer;

function getFormData(form) {
  const data = Object.fromEntries(new FormData(form));
  excludedFields.forEach((field) => delete data[field]);
  return data;
}

export function scheduleDraft(form) {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    writeJson(draftKey, {
      ...getFormData(form),
      updatedAt: new Date().toISOString(),
    });
  }, 250);
}

export function restoreDraft(form) {
  const draft = readJson(draftKey);
  if (!draft) return;

  Object.entries(draft).forEach(([name, value]) => {
    if (name === "updatedAt") return;

    Array.from(form.elements)
      .filter((field) => field.name === name)
      .forEach((field) => {
        if (field.matches('[type="radio"], [type="checkbox"]')) {
          field.checked = field.value === value;
        } else {
          field.value = value;
        }
      });
  });
}

export function saveSubmission(form) {
  clearTimeout(saveTimer);
  return writeJson(submissionKey, {
    ...getFormData(form),
    submittedAt: new Date().toISOString(),
  });
}

export function clearDraft() {
  removeItem(draftKey);
}
