import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { minify } from "html-minifier-terser";
import { defineConfig } from "vite";

const rootDirectory = fileURLToPath(new URL(".", import.meta.url));

function minifyHtml() {
  return {
    name: "minify-html",
    enforce: "post",
    async generateBundle(_options, bundle) {
      for (const output of Object.values(bundle)) {
        if (output.type !== "asset" || !output.fileName.endsWith(".html")) {
          continue;
        }

        output.source = await minify(String(output.source), {
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
          removeComments: true,
          useShortDoctype: true,
        });
      }
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [minifyHtml()],
  build: {
    cssMinify: "esbuild",
    emptyOutDir: true,
    minify: "esbuild",
    rollupOptions: {
      input: {
        cadastro: resolve(rootDirectory, "cadastro.html"),
        index: resolve(rootDirectory, "index.html"),
        projetos: resolve(rootDirectory, "projetos.html"),
      },
    },
    sourcemap: false,
  },
});
