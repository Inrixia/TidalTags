// options.js
// Get the elements from the options page
const inputSettingElement = document.getElementById("inputSetting")!;
const saveButton = document.getElementById("saveButton")!;
const statusMessageElement = document.getElementById("statusMessage")!;

const saveSetting = (Authorization: string) => {
	chrome.storage.local.set({ Authorization }, () => {
		// After the data is saved, retrieve the data again to verify it
		fetchSetting();
		// Update the status message to show that the setting was saved
		statusMessageElement.textContent = "Setting saved.";
		// Clear the status message after 1.5 seconds
		setTimeout(() => (statusMessageElement.textContent = ""), 1500);
	});
};

const fetchSetting = () => chrome.storage.local.get("Authorization", (data) => (inputSettingElement.innerText = data?.Authorization ?? ""));

fetchSetting();
// Save the setting when the user clicks the save button
saveButton.addEventListener("click", () => saveSetting(inputSettingElement.innerText));
