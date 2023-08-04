// Get the elements from the options page
const inputSettingElement = <HTMLInputElement>document.getElementById("inputSetting")!;
const saveButton = document.getElementById("saveButton")!;
const statusMessageElement = document.getElementById("statusMessage")!;

const saveSetting = async (Authorization: string) => {
	await chrome.storage.local.set({ Authorization });

	// Update the status message to show that the setting was saved
	statusMessageElement.textContent = "Setting saved.";
	// Clear the status message after 1.5 seconds
	setTimeout(() => (statusMessageElement.textContent = ""), 1500);
};

const fetchSetting = async () => {
	const data = await new Promise<Record<string, string>>((res) => chrome.storage.local.get("Authorization", res));
	inputSettingElement.value = inputSettingElement.innerText = data?.Authorization ?? "";
};

fetchSetting();
// Save the setting when the user clicks the save button
saveButton.addEventListener("click", () => saveSetting(inputSettingElement.value));
