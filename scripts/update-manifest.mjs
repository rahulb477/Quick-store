import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: [".env.local", ".env"] });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const adminPanelUrl = (process.env.NEXT_PUBLIC_ADMIN_PANEL_URL || "")
  .trim()
  .replace(/\/$/, "");

if (!adminPanelUrl) {
  console.log(
    "Skipping PWA manifest refresh: NEXT_PUBLIC_ADMIN_PANEL_URL is not set.",
  );
  process.exit(0);
}

const apiUrl = `${adminPanelUrl}/api/settings/web`;
const defaultIcon = () => "/quick-store-mark.svg";

async function downloadAndSaveImage(url, filename) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    await fs.writeFile(
      path.join(__dirname, "../public", filename),
      Buffer.from(response.data),
    );
    return `/${filename}`;
  } catch (error) {
    console.error(`Could not fetch configured PWA icon: ${error.message}`);
    return defaultIcon();
  }
}

async function updateManifest() {
  try {
    console.log("Fetching web settings for the PWA manifest...");
    const response = await axios.get(apiUrl, {
      headers: { Accept: "application/json" },
      timeout: 10_000,
    });

    if (!response.data?.success || !response.data?.data) {
      throw new Error("The settings API returned no web settings.");
    }

    const webSettings = response.data.data.value || {};
    const icon144 = webSettings.pwaLogo144x144
      ? await downloadAndSaveImage(webSettings.pwaLogo144x144, "logo-144.png")
      : defaultIcon();
    const icon192 = webSettings.pwaLogo192x192
      ? await downloadAndSaveImage(webSettings.pwaLogo192x192, "logo-192.png")
      : defaultIcon();
    const icon512 = webSettings.pwaLogo512x512
      ? await downloadAndSaveImage(webSettings.pwaLogo512x512, "logo-512.png")
      : defaultIcon();

    const manifestContent = {
      name: webSettings.pwaName || webSettings.siteName || "Quick-store",
      short_name: webSettings.pwaName || webSettings.siteName || "Quick-store",
      description:
        webSettings.pwaDescription ||
        webSettings.shortDescription ||
        "Shop everyday essentials with Quick-store.",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#fbbf24",
      orientation: "portrait",
      icons: [
        {
          src: icon144,
          sizes: icon144.endsWith(".svg") ? "any" : "144x144",
          type: icon144.endsWith(".svg") ? "image/svg+xml" : "image/png",
        },
        {
          src: icon192,
          sizes: icon192.endsWith(".svg") ? "any" : "192x192",
          type: icon192.endsWith(".svg") ? "image/svg+xml" : "image/png",
        },
        {
          src: icon512,
          sizes: icon512.endsWith(".svg") ? "any" : "512x512",
          type: icon512.endsWith(".svg") ? "image/svg+xml" : "image/png",
        },
      ],
    };

    const manifestPath = path.join(__dirname, "../public/manifest.json");
    await fs.writeFile(
      manifestPath,
      `${JSON.stringify(manifestContent, null, 2)}\n`,
      "utf8",
    );
    console.log("Updated public/manifest.json from backend settings.");
  } catch (error) {
    console.error(`Could not refresh the PWA manifest: ${error.message}`);
    console.log("Keeping the committed Quick-store manifest.");
  }
}

await updateManifest();
