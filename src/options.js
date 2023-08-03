// options.js
// Get the elements from the options page
const inputSettingElement = document.getElementById("inputSetting");
const saveButton = document.getElementById("saveButton");
const statusMessageElement = document.getElementById("statusMessage");

const saveSetting = (Authorization) => {
	chrome.storage.local.set({ Authorization }, () => {
		// After the data is saved, retrieve the data again to verify it
		fetchSetting();
		// Update the status message to show that the setting was saved
		statusMessageElement.textContent = "Setting saved.";
		// Clear the status message after 1.5 seconds
		setTimeout(() => (statusMessageElement.textContent = ""), 1500);
	});
};

const setAuth = (data) => (inputSettingElement.value = data?.Authorization ?? "");
const fetchSetting = () => chrome.storage.local.get("Authorization", setAuth);

fetchSetting();
// Save the setting when the user clicks the save button
saveButton.addEventListener("click", () => saveSetting(inputSettingElement.value));
