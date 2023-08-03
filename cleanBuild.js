const fs = require("fs");
const path = require("path");

function copyFolderSync(source, destination) {
	// Create the destination folder if it doesn't exist
	if (!fs.existsSync(destination)) fs.mkdirSync(destination);

	// Get the list of files and subdirectories in the source folder
	const files = fs.readdirSync(source);

	// Loop through each file/directory and copy it to the destination folder
	files.forEach((file) => {
		const sourcePath = path.join(source, file);
		const destinationPath = path.join(destination, file);

		const stat = fs.statSync(sourcePath);

		if (stat.isFile()) fs.copyFileSync(sourcePath, destinationPath);
		else if (stat.isDirectory()) copyFolderSync(sourcePath, destinationPath);
	});
}

fs.rm("./build", () => {
	recursive: true;
});
fs.mkdirSync("./build/chrome", { recursive: true });
fs.mkdirSync("./build/firefox", { recursive: true });
fs.copyFileSync("manifest.chrome.json", "./build/chrome/manifest.json");
fs.copyFileSync("manifest.firefox.json", "./build/firefox/manifest.json");
// copyFolderSync("./src", "./build/chrome");
// copyFolderSync("./src", "./build/firefox");
