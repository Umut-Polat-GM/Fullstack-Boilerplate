import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { logger } from "#lib/logger.js";

const modulesDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * Discovers every feature module (src/modules/<name>/index.js).
 * Adding a new feature = adding a folder; no central file needs editing.
 * Create one with: npm run generate <name>
 */
export async function loadModules() {
  const entries = await readdir(modulesDir, { withFileTypes: true });
  const modules = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith("_")) continue;

    const entryFile = path.join(modulesDir, entry.name, "index.js");
    try {
      const { default: mod } = await import(pathToFileURL(entryFile).href);
      if (!mod?.router || !mod?.basePath) {
        logger.warn(`Module "${entry.name}" skipped: index.js must export { basePath, router }`);
        continue;
      }
      modules.push({ name: entry.name, ...mod });
    } catch (error) {
      if (error.code === "ERR_MODULE_NOT_FOUND" && error.url === pathToFileURL(entryFile).href) {
        logger.warn(`Module "${entry.name}" skipped: missing index.js`);
        continue;
      }
      throw error;
    }
  }

  return modules.sort((a, b) => a.name.localeCompare(b.name));
}
