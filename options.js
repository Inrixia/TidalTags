// options.js
// Get the elements from the options page
const inputSettingElement = document.getElementById("inputSetting");
const saveButton = document.getElementById("saveButton");
const statusMessageElement = document.getElementById("statusMessage");

// Function to update the input element with the current setting value
function updateInputSetting(value) {
	inputSettingElement.value = value;
}

// Function to save the setting to chrome.storage.sync
function saveSetting(value) {
	chrome.storage.sync.set({ stringSetting: value }, function () {
		// Update the status message to show that the setting was saved
		statusMessageElement.textContent = "Setting saved.";
		// Clear the status message after 1.5 seconds
		setTimeout(function () {
			statusMessageElement.textContent = "";
		}, 1500);
	});
}

// Restore the saved setting when the options page loads
chrome.storage.sync.get({ stringSetting: "" }, function (data) {
	// Pre-populate the input element with the current setting value
	updateInputSetting(data.stringSetting);
});

// Save the setting when the user clicks the save button
saveButton.addEventListener("click", function () {
	const stringSettingValue = inputSettingElement.value;
	saveSetting(stringSettingValue);
});
