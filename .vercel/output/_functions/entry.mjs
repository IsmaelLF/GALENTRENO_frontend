import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_Ckg5QGZJ.mjs';
import { manifest } from './manifest_BwBVqvpl.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/inicio.astro.mjs');
const _page2 = () => import('./pages/meus-plans.astro.mjs');
const _page3 = () => import('./pages/plan/_id_.astro.mjs');
const _page4 = () => import('./pages/plans/novo.astro.mjs');
const _page5 = () => import('./pages/plans.astro.mjs');
const _page6 = () => import('./pages/rexistro.astro.mjs');
const _page7 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/inicio.astro", _page1],
    ["src/pages/meus-plans.astro", _page2],
    ["src/pages/plan/[id].astro", _page3],
    ["src/pages/plans/novo.astro", _page4],
    ["src/pages/plans/index.astro", _page5],
    ["src/pages/rexistro.astro", _page6],
    ["src/pages/index.astro", _page7]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "16d59571-4588-4fe1-a598-e7b9db9aead5",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
