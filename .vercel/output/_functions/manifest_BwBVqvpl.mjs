import 'kleur/colors';
import { q as decodeKey } from './chunks/astro/server_DCwYPVM9.mjs';
import 'clsx';
import 'cookie';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_C1f2KnCH.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/User/Documents/GALENTRENO/frontend/","cacheDir":"file:///C:/Users/User/Documents/GALENTRENO/frontend/node_modules/.astro/","outDir":"file:///C:/Users/User/Documents/GALENTRENO/frontend/dist/","srcDir":"file:///C:/Users/User/Documents/GALENTRENO/frontend/src/","publicDir":"file:///C:/Users/User/Documents/GALENTRENO/frontend/public/","buildClientDir":"file:///C:/Users/User/Documents/GALENTRENO/frontend/dist/client/","buildServerDir":"file:///C:/Users/User/Documents/GALENTRENO/frontend/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"inicio/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/inicio","isIndex":false,"type":"page","pattern":"^\\/inicio\\/?$","segments":[[{"content":"inicio","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/inicio.astro","pathname":"/inicio","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"meus-plans/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/meus-plans","isIndex":false,"type":"page","pattern":"^\\/meus-plans\\/?$","segments":[[{"content":"meus-plans","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/meus-plans.astro","pathname":"/meus-plans","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"plans/novo/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/plans/novo","isIndex":false,"type":"page","pattern":"^\\/plans\\/novo\\/?$","segments":[[{"content":"plans","dynamic":false,"spread":false}],[{"content":"novo","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/plans/novo.astro","pathname":"/plans/novo","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"plans/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/plans","isIndex":true,"type":"page","pattern":"^\\/plans\\/?$","segments":[[{"content":"plans","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/plans/index.astro","pathname":"/plans","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"rexistro/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/rexistro","isIndex":false,"type":"page","pattern":"^\\/rexistro\\/?$","segments":[[{"content":"rexistro","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/rexistro.astro","pathname":"/rexistro","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"inline","content":".dia-card[data-astro-cid-gnlcd72u]{background:#fff;border-radius:8px;padding:1rem;margin-bottom:1rem;box-shadow:0 2px 4px #0000000d}.dia-card[data-astro-cid-gnlcd72u] h3[data-astro-cid-gnlcd72u]{margin-top:0}\nheader[data-astro-cid-3ef6ksr2]{background-color:#fff;box-shadow:0 2px 4px #0000001a}nav[data-astro-cid-3ef6ksr2]{display:flex;justify-content:space-between;align-items:center;max-width:1200px;margin:0 auto}.logo[data-astro-cid-3ef6ksr2]{font-weight:700;font-size:1.5rem;color:#091e42;text-decoration:none}.nav-links[data-astro-cid-3ef6ksr2]{list-style:none;margin:0;padding:0;display:flex;gap:1.5rem}.nav-links[data-astro-cid-3ef6ksr2] a[data-astro-cid-3ef6ksr2]{text-decoration:none;color:#5e6c84;font-weight:600}body{font-family:BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background-color:#f4f5f7;margin:0;color:#172b4d}h1{font-size:2rem;font-weight:600;text-align:center}h2{font-size:1.2rem;font-weight:500;margin-top:2rem;margin-bottom:1rem;color:#5e6c84}small{color:#5e6c84;font-weight:500}.card{background-color:#fff;padding:1rem;border-radius:12px;text-align:center;box-shadow:0 4px 6px #0000000d;border:1px solid rgba(0,0,0,.05)}.card strong{font-size:1.5rem;display:block;margin-bottom:.25rem}.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin:1.5rem 0}.button{border:none;padding:1em;margin:1rem auto;width:100%;background-color:#112f63;color:#fff;border-radius:10px;font-size:1rem;font-weight:600;cursor:pointer;text-align:center;display:block;text-decoration:none}.button-register,.button-login{background-color:#24457f;color:#fff;width:20%}a{color:#fff;text-decoration:none}.session-item{background-color:#fff;padding:1rem;border-radius:12px;margin-bottom:.75rem;box-shadow:0 4px 6px #0000000d;border:1px solid rgba(0,0,0,.05)}label{font-weight:600;color:#172b4d}form{display:flex;flex-direction:column;gap:1rem;margin:0 auto;width:40%}.plans-container{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1rem}.plan-card{background-color:#112f63;color:#fff;padding:1rem;border-radius:12px;box-shadow:0 4px 6px #0000000d;border:1px solid rgba(0,0,0,.05);text-decoration:none;display:block}.plan-card h3{margin-top:0}label{font-weight:600;color:#172b4d;display:block;margin-bottom:.25rem}input[type=text],input[type=email],input[type=password],input[type=number],select{width:100%;padding:.75rem 1rem;border-radius:8px;border:1px solid #dfe1e6;font-size:1rem;font-family:inherit;box-sizing:border-box;transition:border-color .2s,box-shadow .2s}input[type=text]:focus,input[type=email]:focus,input[type=password]:focus,input[type=number]:focus,select:focus{outline:none;border-color:#112f63;box-shadow:0 0 0 3px #112f631a}\n"}],"routeData":{"route":"/plan/[id]","isIndex":false,"type":"page","pattern":"^\\/plan\\/([^/]+?)\\/?$","segments":[[{"content":"plan","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/plan/[id].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/User/Documents/GALENTRENO/frontend/src/pages/inicio.astro",{"propagation":"none","containsHead":true}],["C:/Users/User/Documents/GALENTRENO/frontend/src/pages/meus-plans.astro",{"propagation":"none","containsHead":true}],["C:/Users/User/Documents/GALENTRENO/frontend/src/pages/plan/[id].astro",{"propagation":"none","containsHead":true}],["C:/Users/User/Documents/GALENTRENO/frontend/src/pages/plans/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/User/Documents/GALENTRENO/frontend/src/pages/plans/novo.astro",{"propagation":"none","containsHead":true}],["C:/Users/User/Documents/GALENTRENO/frontend/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/User/Documents/GALENTRENO/frontend/src/pages/rexistro.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/inicio@_@astro":"pages/inicio.astro.mjs","\u0000@astro-page:src/pages/meus-plans@_@astro":"pages/meus-plans.astro.mjs","\u0000@astro-page:src/pages/plan/[id]@_@astro":"pages/plan/_id_.astro.mjs","\u0000@astro-page:src/pages/plans/novo@_@astro":"pages/plans/novo.astro.mjs","\u0000@astro-page:src/pages/plans/index@_@astro":"pages/plans.astro.mjs","\u0000@astro-page:src/pages/rexistro@_@astro":"pages/rexistro.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_BwBVqvpl.mjs","C:/Users/User/Documents/GALENTRENO/frontend/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_B7yIAQoD.mjs","C:/Users/User/Documents/GALENTRENO/frontend/src/components/CrearPlan.vue":"_astro/CrearPlan.Bx-ntUW2.js","C:/Users/User/Documents/GALENTRENO/frontend/src/components/RegisterForm.vue":"_astro/RegisterForm.rBTHh-gi.js","C:/Users/User/Documents/GALENTRENO/frontend/src/components/LoginForm.vue":"_astro/LoginForm.CwANIcGt.js","@astrojs/vue/client.js":"_astro/client.BO68oRZq.js","C:/Users/User/Documents/GALENTRENO/frontend/src/layouts/AuthLayout.astro?astro&type=script&index=0&lang.ts":"_astro/AuthLayout.astro_astro_type_script_index_0_lang.C85reifo.js","C:/Users/User/Documents/GALENTRENO/frontend/src/components/Header.astro?astro&type=script&index=0&lang.ts":"_astro/Header.astro_astro_type_script_index_0_lang.m8pjMe0V.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["C:/Users/User/Documents/GALENTRENO/frontend/src/layouts/AuthLayout.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"DOMContentLoaded\",()=>{const s=document.querySelector(\".deco-under\"),e=document.querySelector(\".scroll-track\");if(!s||!e)return;const c=.3,l=15,d=.98;let n=c,t=0,r=0;function o(){if(!e)return;e.querySelectorAll(\"img\").length>0&&(r=e.scrollWidth/2)}o(),window.addEventListener(\"resize\",o);function i(){r===0&&o(),t+=n,n=Math.max(c,n*d),t>=r&&(t=t-r),e&&(e.style.transform=`translateX(-${t}px)`,requestAnimationFrame(i))}s.addEventListener(\"wheel\",a=>{a.preventDefault(),a.stopPropagation(),n=l},{passive:!1}),requestAnimationFrame(i)});"],["C:/Users/User/Documents/GALENTRENO/frontend/src/components/Header.astro?astro&type=script&index=0&lang.ts","const e=document.getElementById(\"logout-link\");e&&e.addEventListener(\"click\",t=>{t.preventDefault(),localStorage.removeItem(\"jwt_token\"),window.location.href=\"/\"});"]],"assets":["/favicon.ico","/fonts/texgyreheros-bold.otf","/_astro/client.BO68oRZq.js","/_astro/CrearPlan.Bx-ntUW2.js","/_astro/index.DBZbHhp5.css","/_astro/LoginForm.CwANIcGt.js","/_astro/novo.D1ILUF2U.css","/_astro/RegisterForm.rBTHh-gi.js","/_astro/rexistro.B70x6SnZ.css","/_astro/runtime-dom.esm-bundler.BAXGyn3T.js","/_astro/_plugin-vue_export-helper.DlAUqK2U.js","/inicio/index.html","/meus-plans/index.html","/plans/novo/index.html","/plans/index.html","/rexistro/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"yfAq58bPZD/+lMA3MPSzVytPWBk9jABDEcV4JFYgNuk="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
