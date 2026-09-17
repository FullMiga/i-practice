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
- Vite para servidor de desenvolvimento e build de produção.
- esbuild e html-minifier-terser para minificação dos ativos.
- Git e GitHub com fluxo baseado em GitFlow.

O projeto não utiliza framework ou biblioteca JavaScript em produção. As APIs
nativas atendem às necessidades atuais sem adicionar dependências ao navegador.

## Pré-requisitos

- Navegador moderno com suporte a ES6 Modules, Fetch API e History API.
- Node.js 20.19 ou superior e npm para desenvolvimento e build.
- Git para trabalhar com branches e histórico de versões.

## Execução local

Clone o repositório e acesse sua pasta:

```bash
git clone https://github.com/FullMiga/i-practice.git
cd i-practice
```

Instale as ferramentas de desenvolvimento e inicie o servidor local:

```bash
npm install
npm run dev
```

Acesse o endereço indicado pelo Vite no terminal. Não abra os arquivos
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

Gere os arquivos otimizados para produção:

```bash
npm run build
```

O Vite processa as três páginas HTML como entradas independentes, agrupa os
módulos, adiciona hashes aos ativos e minifica CSS e JavaScript com esbuild. Um
plugin local utiliza `html-minifier-terser` para remover comentários e espaços
desnecessários do HTML. O resultado é gravado em `dist/` sem source maps.

Valide localmente a build final com:

```bash
npm run preview
```

O provedor de hospedagem deve executar `npm run build` e publicar a pasta
`dist/`.

Por utilizar rotas baseadas em arquivos HTML, o servidor deve disponibilizar
`index.html`, `projetos.html`, `cadastro.html` e todos os arquivos de `assets`.

## Deploy

A aplicação é publicada em
[GitHub Pages](https://fullmiga.github.io/i-practice/) pelo workflow
`.github/workflows/deploy-pages.yml`. Cada push na branch `main` instala as
dependências com `npm ci`, executa `npm run build`, envia a pasta `dist/` como
artefato e publica uma nova versão automaticamente.

## Estrutura

```text
i-practice/
├── index.html
├── projetos.html
├── cadastro.html
├── package.json
├── vite.config.js
├── .github/workflows/deploy-pages.yml
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
