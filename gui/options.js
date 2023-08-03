// options.js
// Get the elements from the options page
const inputSettingElement = document.getElementById("inputSetting");
const saveButton = document.getElementById("saveButton");
const statusMessageElement = document.getElementById("statusMessage");

// Function to update the input element with the current setting value
const updateInputSetting = (value) => (inputSettingElement.value = value);

// Function to save the setting to chrome.storage.sync
const saveSetting = (value) => {
	chrome.storage.sync.set({ Authorization: value }, function () {
		// Update the status message to show that the setting was saved
		statusMessageElement.textContent = "Setting saved.";
		// Clear the status message after 1.5 seconds
		setTimeout(() => {
			statusMessageElement.textContent = "";
		}, 1500);
	});
};

// Restore the saved setting when the options page loads
chrome.storage.sync.get({ Authorization: "" }, (data) => updateInputSetting(data.Authorization));

// Save the setting when the user clicks the save button
saveButton.addEventListener("click", () => saveSetting(inputSettingElement.value));
