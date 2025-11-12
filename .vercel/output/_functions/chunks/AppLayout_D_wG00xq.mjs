import { e as createComponent, m as maybeRenderHead, n as renderScript, r as renderTemplate, f as createAstro, o as renderHead, k as renderComponent, p as renderSlot } from './astro/server_DCwYPVM9.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                          */

const $$Header = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<header data-astro-cid-3ef6ksr2> <nav data-astro-cid-3ef6ksr2> <a href="/inicio" class="logo" data-astro-cid-3ef6ksr2> <img src="/img/logo.png" alt="Logo" style="width: 150px; height: 150px; display: block;" data-astro-cid-3ef6ksr2> </a> <ul class="nav-links" data-astro-cid-3ef6ksr2> <li data-astro-cid-3ef6ksr2><a href="/inicio" data-astro-cid-3ef6ksr2>Inicio</a></li> <li data-astro-cid-3ef6ksr2><a href="/plans" data-astro-cid-3ef6ksr2>Plans</a></li> <li data-astro-cid-3ef6ksr2><a href="#" id="logout-link" data-astro-cid-3ef6ksr2>Pechar Sesión</a></li> </ul> </nav> </header> ${renderScript($$result, "C:/Users/User/Documents/GALENTRENO/frontend/src/components/Header.astro?astro&type=script&index=0&lang.ts")} `;
}, "C:/Users/User/Documents/GALENTRENO/frontend/src/components/Header.astro", void 0);

const $$Astro = createAstro();
const $$AppLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AppLayout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><link rel="icon" type="image/x-icon" href="/favicon.ico">${renderHead()}</head> <body> ${renderComponent($$result, "Header", $$Header, {})} ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "C:/Users/User/Documents/GALENTRENO/frontend/src/layouts/AppLayout.astro", void 0);

export { $$AppLayout as $ };
