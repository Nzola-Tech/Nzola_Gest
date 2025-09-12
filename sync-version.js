// sync-version.js (ESM)
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
const tauriConfPath = path.join(__dirname, "src-tauri", "tauri.conf.json");
const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, "utf-8"));

if (tauriConf.version !== pkg.version) {
  tauriConf.version = pkg.version;
  fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2));
} else {
  console.log(`ℹ️ Versão já está sincronizada: ${pkg.version}`);
}
