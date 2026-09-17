# Horizonte Azul

Aplicação front-end para a ONG fictícia Horizonte Azul. O projeto apresenta as
iniciativas da organização, formas de contribuição e um cadastro de pessoas
voluntárias e apoiadoras.

## Funcionalidades

- Navegação SPA baseada na History API, sem recarregar o documento completo.
- Páginas responsivas para apresentação, projetos e cadastro.
- Menu mobile e dropdown acessíveis por mouse e teclado.
- Componentes repetitivos gerados com `template` HTML5 e JavaScript.
- Formulário com máscaras, validação em tempo real e mensagens acessíveis.
- Persistência de rascunho e último envio utilizando `localStorage`.
- Tratamento de falhas de rede, navegações concorrentes e indisponibilidade do armazenamento.

## Tecnologias

- HTML5 semântico.
- CSS3 com propriedades personalizadas, Grid, Flexbox e media queries.
- JavaScript moderno com ES6 Modules, Fetch API, History API e DOM API.
- Web Storage API para persistência local.
- Google Fonts para carregamento da família Inter.
- Git e GitHub com fluxo baseado em GitFlow.

O projeto não utiliza framework ou biblioteca JavaScript em produção. As APIs
nativas atendem às necessidades atuais sem adicionar dependências ao navegador.

## Pré-requisitos

- Navegador moderno com suporte a ES6 Modules, Fetch API e History API.
- Python 3 ou outro servidor HTTP local.
- Node.js 20 ou superior para executar as ferramentas de validação com `npx`.
- Git para trabalhar com branches e histórico de versões.

## Execução local

Clone o repositório e acesse sua pasta:

```bash
git clone https://github.com/FullMiga/i-practice.git
cd i-practice
```

O projeto não possui dependências de execução e, portanto, não exige
`npm install`. Inicie um servidor local:

```bash
python3 -m http.server 4173
```

Acesse `http://localhost:4173/index.html` no navegador. Não abra os arquivos
diretamente pelo protocolo `file://`, pois a SPA utiliza `fetch()`.

## Validação e testes

Validação da estrutura HTML:

```bash
npx --yes html-validate@10.4.0 index.html projetos.html cadastro.html
```

Verificação da formatação:

```bash
npx --yes prettier@3.6.2 --check "assets/js/**/*.js" "assets/js/*.js" "assets/css/styles.css"
```

Validação dos módulos e da árvore de imports:

```bash
npx --yes esbuild@0.25.10 assets/js/navigation.js assets/js/components.js assets/js/cadastro.js --bundle --format=esm --outdir=/tmp/horizonte-build
```

Também devem ser testados manualmente a navegação por teclado, os botões
voltar/avançar, a persistência do formulário, os estados de validação e a
interface nos tamanhos desktop e mobile.

## Build e produção

A aplicação é estática e não exige uma etapa obrigatória de compilação. Os
arquivos HTML e a pasta `assets` são os artefatos de produção. Antes do deploy,
execute as validações acima e configure o provedor para publicar a raiz do
repositório.

Por utilizar rotas baseadas em arquivos HTML, o servidor deve disponibilizar
`index.html`, `projetos.html`, `cadastro.html` e todos os arquivos de `assets`.

## Estrutura

```text
i-practice/
├── index.html
├── projetos.html
├── cadastro.html
├── assets/
│   ├── css/styles.css
│   ├── images/
│   └── js/
│       ├── cadastro.js
│       ├── components.js
│       ├── navigation.js
│       └── modules/
│           ├── feedback.js
│           ├── form-persistence.js
│           ├── formatters.js
│           ├── storage.js
│           └── validation.js
└── README.md
```

## Arquitetura JavaScript

- `navigation.js`: navegação SPA, histórico, menu e tratamento de rede.
- `components.js`: renderização dos templates de projetos e etapas.
- `cadastro.js`: coordenação dos eventos do formulário.
- `modules/validation.js`: consistência dos campos e mensagens acessíveis.
- `modules/form-persistence.js`: rascunho e submissão persistidos.
- `modules/storage.js`: leitura, gravação e remoção no `localStorage`.
- `modules/formatters.js`: máscaras de CPF, telefone e CEP.
- `modules/feedback.js`: notificações por toast.

Os módulos se comunicam por imports explícitos e pelo evento `spa:render`, sem
variáveis globais compartilhadas.

## Acessibilidade

O projeto utiliza landmarks semânticos, hierarquia de títulos, foco visível,
labels associados, mensagens com `aria-describedby`, estados com
`aria-invalid`, áreas dinâmicas com `role="alert"` ou `role="status"` e suporte
a `prefers-reduced-motion`.

## Versionamento

- `main`: versões estáveis.
- `develop`: integração contínua.
- `feature/*`: novas funcionalidades.
- `release/*`: preparação de lançamentos.
- `hotfix/*`: correções urgentes de produção.

Os commits seguem Conventional Commits e as releases utilizam Versionamento
Semântico, como a tag `v1.0.0`.

## Manutenção

Ao adicionar uma página, mantenha um elemento `<main id="app">`, carregue os
scripts como `type="module"` e registre a rota permitida em `navigation.js`.
Novos componentes repetitivos devem utilizar dados estruturados e templates,
evitando duplicação manual de marcação.

Dados sensíveis, como CPF e consentimento, não são persistidos no
`localStorage`. Alterações nessa política devem ser acompanhadas por revisão de
privacidade e segurança.
