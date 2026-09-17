const initiatives = Object.freeze([
  {
    title: "Educação para o futuro",
    description:
      "Reforço escolar, incentivo à leitura e inclusão digital para crianças e jovens.",
    meta: "Oficinas semanais:",
    result: "480 participantes.",
  },
  {
    title: "Alimento que acolhe",
    description:
      "Segurança alimentar e oficinas de nutrição para famílias em situação de vulnerabilidade.",
    meta: "Ações mensais:",
    result: "520 famílias atendidas.",
  },
  {
    title: "Caminhos profissionais",
    description:
      "Cursos, mentoria e conexões para ampliar oportunidades de trabalho e geração de renda.",
    meta: "Turmas trimestrais:",
    result: "200 participantes.",
  },
]);

const steps = Object.freeze([
  {
    title: "Escolha como ajudar",
    description: "Doe, seja voluntário ou compartilhe uma campanha.",
  },
  {
    title: "Preencha seus dados",
    description: "Conte seus interesses e sua disponibilidade.",
  },
  {
    title: "Receba nosso contato",
    description: "Nossa equipe orientará os próximos passos.",
  },
]);

function renderTemplateList(container, template, data, fillTemplate) {
  const fragment = document.createDocumentFragment();

  data.forEach((item) => {
    const clone = template.content.cloneNode(true);
    fillTemplate(clone, item);
    fragment.append(clone);
  });

  container.replaceChildren(fragment);
}

function renderComponents() {
  const initiativeList = document.querySelector(
    '[data-template-list="initiatives"]',
  );
  const initiativeTemplate = document.querySelector("#initiative-template");
  const stepList = document.querySelector('[data-template-list="steps"]');
  const stepTemplate = document.querySelector("#step-template");

  if (initiativeList && initiativeTemplate) {
    renderTemplateList(
      initiativeList,
      initiativeTemplate,
      initiatives,
      (clone, item) => {
        clone.querySelector("h3").textContent = item.title;
        clone.querySelector(".description").textContent = item.description;
        clone.querySelector(".meta strong").textContent = item.meta;
        clone.querySelector(".meta span").textContent = item.result;
      },
    );
  }

  if (stepList && stepTemplate) {
    renderTemplateList(stepList, stepTemplate, steps, (clone, item) => {
      clone.querySelector("h3").textContent = item.title;
      clone.querySelector("p").textContent = item.description;
    });
  }
}

document.addEventListener("spa:render", renderComponents);
renderComponents();
