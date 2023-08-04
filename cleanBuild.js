const fs = require("fs");
const path = require("path");

fs.rm("./build", () => null);
fs.mkdirSync("./build/chrome", { recursive: true });
fs.mkdirSync("./build/firefox", { recursive: true });

const adjustManifest = (srcPath, destPath) => fs.writeFileSync(destPath, fs.readFileSync(srcPath, "utf8").replace(/\.ts/g, ".js"));

adjustManifest("manifest.chrome.json", "./build/chrome/manifest.json");
adjustManifest("manifest.firefox.json", "./build/firefox/manifest.json");
