import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.dirname(fileURLToPath(import.meta.url));
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isGithubPagesBuild = process.env.GITHUB_ACTIONS === "true" && repoName.length > 0;
const isUserOrOrgPagesSite = repoName.endsWith(".github.io");
const pagesBasePath = isGithubPagesBuild && !isUserOrOrgPagesSite ? `/${repoName}` : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  output: "export",
  basePath: pagesBasePath || undefined,
  assetPrefix: pagesBasePath || undefined,
  images: {
    unoptimized: true
  },
  turbopack: {
    root: appRoot
  }
};

export default nextConfig;
