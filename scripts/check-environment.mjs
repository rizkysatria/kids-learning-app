import { execSync } from "node:child_process";
for (const cmd of ["node --version", "npm --version"]) {
  try { console.log(`${cmd}: ${execSync(cmd).toString().trim()}`); }
  catch { console.error(`Missing command: ${cmd}`); process.exit(1); }
}
console.log("Environment looks ready.");
