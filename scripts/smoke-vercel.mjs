const api = await import("../api/index.js");

const BASE_URL = "https://edgemirror.vercel.app";
const PRIMARY_ORIGIN = "https://mirror.ygmm.de";
const TOOLS = [
  { key: "portal", path: "/edgemirror", host: "mirror.ygmm.de" },
  { key: "pypi", path: "/pypi", host: "mirror.ygmm.de" },
  { key: "hf", path: "/hf", host: "mirror.ygmm.de" },
  { key: "github", path: "/github", host: "mirror.ygmm.de" },
  { key: "docker", path: "/docker", host: "mirror.ygmm.de" },
  { key: "mirrors", path: "/mirrors", host: "mirror.ygmm.de" },
  { key: "proxy", path: "/proxy", host: "mirror.ygmm.de" },
  { key: "npm", path: "/npm", host: "mirror.ygmm.de" },
  { key: "go", path: "/go", host: "mirror.ygmm.de" },
  { key: "maven", path: "/maven", host: "mirror.ygmm.de" },
  { key: "crates", path: "/crates", host: "mirror.ygmm.de" },
  { key: "downloads", path: "/downloads", host: "mirror.ygmm.de" },
  { key: "help", path: "/help", host: "mirror.ygmm.de" },
];

const PAGE_IDENTITY = new Map([
  ["portal", "Edge mirrors"],
  ["pypi", "PyTorch"],
  ["hf", "Model hub accelerator"],
  ["github", "GitHub"],
  ["docker", "Docker Proxy Accelerator"],
  ["mirrors", "Linux repository accelerator"],
  ["proxy", "Universal File Fetcher"],
  ["npm", "npm / pnpm / yarn Proxy"],
  ["go", "Go Module Proxy"],
  ["maven", "Maven / Gradle Proxy"],
  ["crates", "crates.io Sparse Proxy"],
  ["downloads", "Runtime & Release Downloads"],
  ["help", "One domain. Every accelerator."],
]);

const checks = [
  {
    name: "health",
    request: new Request(`${BASE_URL}/healthz`),
    assert: async (response) => {
      const payload = await response.json();
      return response.status === 200 && payload.status === "ok" && Array.isArray(payload.tools);
    },
  },
  {
    name: "ads.txt",
    request: new Request(`${BASE_URL}/ads.txt`),
    assert: async (response) => {
      const text = await response.text();
      return response.status === 200
        && response.headers.get("content-type")?.includes("text/plain")
        && text.trim() === "google.com, pub-8741919641227561, DIRECT, f08c47fec0942fa0";
    },
  },
  {
    name: "portal path route",
    request: new Request(`${BASE_URL}/edgemirror`),
    assert: async (response) => response.status === 200 && response.headers.get("content-type")?.includes("text/html"),
  },
  {
    name: "github path route",
    request: new Request(`${BASE_URL}/github`),
    assert: async (response) => response.status === 200 && response.headers.get("content-type")?.includes("text/html"),
  },
  {
    name: "docker registry route detection",
    request: new Request(`${BASE_URL}/v2/`, { method: "HEAD" }),
    assert: async (response) => [200, 401].includes(response.status),
  },
  {
    name: "npm metadata rewrite",
    request: new Request(`${BASE_URL}/npm/lodash`),
    assert: async (response) => {
      const text = await response.text();
      return response.status === 200 && text.includes(`${BASE_URL}/npm/lodash/-/`);
    },
  },
  {
    name: "crates sparse config rewrite",
    request: new Request(`${BASE_URL}/crates/config.json`),
    assert: async (response) => {
      const payload = await response.json();
      return response.status === 200 && payload.dl === `${BASE_URL}/crates/api/v1/crates`;
    },
  },
  {
    name: "help default chinese",
    request: new Request(`${BASE_URL}/help`),
    assert: async (response) => {
      const html = await response.text();
      return response.status === 200
        && html.includes("一个域名，所有加速入口。")
        && html.includes('lang="zh-CN"')
        && html.includes(`${BASE_URL}/pypi"`);
    },
  },
  {
    name: "help spanish language",
    request: new Request(`${BASE_URL}/help?lang=es`),
    assert: async (response) => {
      const html = await response.text();
      return response.status === 200 && html.includes("Un dominio. Todos los aceleradores.") && html.includes('lang="es"') && html.includes("/pypi?lang=es");
    },
  },
  {
    name: "help english language",
    request: new Request(`${BASE_URL}/help?lang=en`),
    assert: async (response) => {
      const html = await response.text();
      return response.status === 200 && html.includes("One domain. Every accelerator.") && html.includes('lang="en"') && html.includes("/pypi?lang=en");
    },
  },
];

for (const check of checks) {
  const response = await api.default.fetch(check.request);
  if (!(await check.assert(response))) {
    throw new Error(`${check.name} failed with status ${response.status}`);
  }
  console.log(`ok ${check.name}`);
}

for (const tool of TOOLS) {
  const response = await api.default.fetch(new Request(`${BASE_URL}${tool.path}?lang=en`));
  const html = await response.text();
  assertHtmlResponse(response, html, `${tool.key} page`);
  assertNavLinks(html, TOOLS.map((item) => urlFor(BASE_URL, item.path, "en")), `${tool.key} path nav`);
  assertPageIdentity(html, tool.key, `${tool.key} path page`);
  console.log(`ok ${tool.key} path page nav`);
}

for (const tool of TOOLS) {
  const response = await api.default.fetch(new Request(`${PRIMARY_ORIGIN}${tool.path}?lang=en`));
  const html = await response.text();
  assertHtmlResponse(response, html, `${tool.key} primary-domain path page`);
  assertNavLinks(html, TOOLS.map((item) => urlFor(PRIMARY_ORIGIN, item.path, "en")), `${tool.key} primary-domain nav`);
  assertPageIdentity(html, tool.key, `${tool.key} primary-domain path page`);
  console.log(`ok ${tool.key} primary-domain path page nav`);
}

const rootResponse = await api.default.fetch(new Request(`${PRIMARY_ORIGIN}/`));
const rootHtml = await rootResponse.text();
assertHtmlResponse(rootResponse, rootHtml, "primary-domain root");
if (!rootHtml.includes('lang="zh-CN"')) {
  throw new Error("primary-domain root should default to Chinese");
}
if (!rootHtml.includes("把每一次安装请求")) {
  throw new Error("primary-domain root should render the portal hero");
}
console.log("ok primary-domain root portal in Chinese");

function assertHtmlResponse(response, html, name) {
  if (response.status !== 200 || !response.headers.get("content-type")?.includes("text/html")) {
    throw new Error(`${name} did not return HTML 200`);
  }
  if (!html.includes('aria-label="Tool navigation"')) {
    throw new Error(`${name} is missing shared tool navigation`);
  }
  if (!html.includes('class="edgemirror-header"')) {
    throw new Error(`${name} is missing unified header wrapper`);
  }
  if (!html.includes('class="edgemirror-lang-switch"') || !html.includes('aria-label="Language switcher"')) {
    throw new Error(`${name} is missing global language switcher`);
  }
  if (!html.includes("window.__EDGEMIRROR_I18N__")) {
    throw new Error(`${name} is missing client i18n payload`);
  }
}

function assertNavLinks(html, expectedLinks, name) {
  const hrefs = [...html.matchAll(/<nav[^>]*aria-label="Tool navigation"[^>]*>([\s\S]*?)<\/nav>/g)]
    .flatMap((match) => [...match[1].matchAll(/href="([^"]+)"/g)].map((hrefMatch) => hrefMatch[1]));

  for (const link of expectedLinks) {
    if (!hrefs.includes(link)) {
      throw new Error(`${name} is missing ${link}. Found: ${hrefs.join(", ")}`);
    }
  }
}

function assertPageIdentity(html, key, name) {
  const marker = PAGE_IDENTITY.get(key);
  if (marker && !html.includes(marker)) {
    throw new Error(`${name} is missing identity marker: ${marker}`);
  }
}

function urlFor(origin, path, lang = "zh") {
  const url = new URL(path || "/", origin);
  if (lang !== "zh") {
    url.searchParams.set("lang", lang);
  }
  return url.toString();
}
