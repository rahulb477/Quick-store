import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: [".env.local", ".env"] });

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

if (!configuredSiteUrl) {
  console.log(
    "Skipping robots.txt sitemap entry: NEXT_PUBLIC_SITE_URL is not set.",
  );
  process.exit(0);
}

let siteUrl;
try {
  const parsedUrl = new URL(configuredSiteUrl);
  if (!/^https?:$/.test(parsedUrl.protocol)) {
    throw new Error("The site URL must use http or https.");
  }
  siteUrl = configuredSiteUrl.replace(/\/+$/, "");
} catch (error) {
  console.error("Invalid NEXT_PUBLIC_SITE_URL:", error.message);
  process.exit(1);
}

const robotsPath = join(process.cwd(), "public", "robots.txt");
const currentContent = readFileSync(robotsPath, "utf8");
const contentWithoutSitemap = currentContent
  .replace(/^Sitemap:\s*\S+\s*$/gim, "")
  .trimEnd();
const sitemapLine = `Sitemap: ${siteUrl}/sitemap.xml`;

writeFileSync(
  robotsPath,
  `${contentWithoutSitemap}${contentWithoutSitemap ? "\n" : ""}${sitemapLine}\n`,
  "utf8",
);

console.log("Updated robots.txt sitemap URL.");
