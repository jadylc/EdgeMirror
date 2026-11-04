export const PROJECT = {
  name: "EdgeMirror",
  version: "2.0.0",
  primaryHost: "mirror.ygmm.de",
  description: "An edge mirror gateway for developer sources, package registries, model hubs, Docker images, Linux mirrors, runtime downloads, and universal file forwarding.",
};

export const ADS_TXT = "google.com, pub-8741919641227561, DIRECT, f08c47fec0942fa0";

export const HEALTH_PATHS = new Set(["/health", "/healthz", "/__health"]);

export const TOOL_DEFINITIONS = [
  {
    key: "portal",
    title: "EdgeMirror Portal",
    host: "mirror.ygmm.de",
    path: "/edgemirror",
    status: "stable",
    description: "Landing portal for all edge mirror services.",
  },
  {
    key: "pypi",
    title: "PyPI / PyTorch Proxy",
    host: "mirror.ygmm.de",
    path: "/pypi",
    status: "stable",
    description: "PyPI package index, Python wheel, and PyTorch wheel accelerator.",
  },
  {
    key: "hf",
    title: "Hugging Face Proxy",
    host: "mirror.ygmm.de",
    path: "/hf",
    status: "stable",
    description: "Hugging Face API and LFS download accelerator.",
  },
  {
    key: "github",
    title: "GitHub Proxy",
    host: "mirror.ygmm.de",
    path: "/github",
    status: "stable",
    description: "Git clone, release asset, raw file, and GitHub page proxy.",
  },
  {
    key: "docker",
    title: "Docker Registry Proxy",
    host: "mirror.ygmm.de",
    path: "/docker",
    status: "stable",
    description: "Docker Hub and multi-registry image pull accelerator.",
  },
  {
    key: "mirrors",
    title: "Linux Mirrors Proxy",
    host: "mirror.ygmm.de",
    path: "/mirrors",
    status: "stable",
    description: "Pass-through proxy for Linux distribution mirrors.",
  },
  {
    key: "proxy",
    title: "Universal File Proxy",
    host: "mirror.ygmm.de",
    path: "/proxy",
    status: "stable",
    description: "Universal URL-to-download forwarding service.",
    keepPathPrefix: true,
  },
  {
    key: "npm",
    title: "npm Registry Proxy",
    host: "mirror.ygmm.de",
    path: "/npm",
    status: "test",
    description: "npm, pnpm, and yarn registry metadata and tarball accelerator.",
  },
  {
    key: "go",
    title: "Go Module Proxy",
    host: "mirror.ygmm.de",
    path: "/go",
    status: "test",
    description: "GOPROXY-compatible Go module metadata, mod, and zip accelerator.",
  },
  {
    key: "maven",
    title: "Maven / Gradle Proxy",
    host: "mirror.ygmm.de",
    path: "/maven",
    status: "test",
    description: "Maven Central, Google Maven, Gradle Plugin Portal, and JitPack accelerator.",
  },
  {
    key: "crates",
    title: "crates.io Sparse Proxy",
    host: "mirror.ygmm.de",
    path: "/crates",
    status: "test",
    description: "Cargo sparse registry index and crate download accelerator.",
  },
  {
    key: "downloads",
    title: "Runtime Downloads Proxy",
    host: "mirror.ygmm.de",
    path: "/downloads",
    status: "test",
    description: "Runtime, release asset, Open VSX, SourceForge, GitLab, and Gitea file accelerator.",
  },
];

export const HELP_DEFINITION = {
  key: "help",
  title: "Help",
  path: "/help",
  status: "stable",
  description: "Beautiful usage guide, route map, CLI recipes, and deployment notes.",
};

export const CATALOG_DEFINITION = {
  key: "catalog",
  title: "Catalog & Setup",
  path: "/catalog",
  status: "stable",
  description: "Search every system source and generate verified package-manager configuration.",
};
