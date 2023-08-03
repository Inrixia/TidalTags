let itemsToProcess = [];

// Helper function to check if item exists in itemsToProcess array
function itemExists(id) {
	return itemsToProcess.some((item) => item.id === id);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log(request, sender);
	// todo cleanup this monstrocity
	let newItems = request.data.filter((item) => !itemExists(item.id));
	itemsToProcess.push(...newItems); // Store the items
	processItems();
	sendResponse();
});

const style = document.createElement("style");
style.textContent = `
.tag {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 0 8px;
    height: 18px;
    font-size: 12px;
    line-height: 20px;
    border-radius: 16px;
    color: rgba(0, 0, 0, 0.87); /* Text color */
    box-sizing: border-box;
    transition: background-color 0.2s;
    margin-left: 5px;
}
.tag-mqa {
    background-color: #ffd700; /* Golden color */
}
.tag-hr {
    background-color: #b9f2ff; /* Diamond-like color */
}
.tag-atmos {
	background-color: #003366; /* Dark blue color */
}
.tag:hover {
    background-color: #d0d0d0; /* Change color when mouse is over */
}
`;
document.head.appendChild(style);

const processItems = () => {
	// Stop observing
	observer.disconnect();

	for (const item of itemsToProcess) {
		const firstSpan = document.querySelectorAll(`span[data-id='${item.id}']`).item(0);
		if (firstSpan) {
			// Get the current text content of the span
			const currentText = firstSpan.textContent;

			// Check if the original text content is stored on the item
			// If not, store the current text content as the original text content
			if (item.originalText === undefined) item.originalText = currentText;

			// If the current text content is the same as the original text content
			if (currentText === item.originalText) {
				for (const tag of item.mediaMetadata.tags) {
					let className;
					let textContent;
					switch (tag) {
						case "LOSSLESS":
							continue;
						case "MQA":
							className = "tag tag-mqa";
							textContent = "MQA";
							break;
						case "HIRES_LOSSLESS":
							className = "tag tag-hr";
							textContent = "HiRes";
							break;
						case "DOLBY_ATMOS":
							className = "tag tag-atmos";
							textContent = "Atmos";
					}
					const tagElement = document.createElement("span");
					tagElement.className = className;
					tagElement.textContent = textContent;
					firstSpan.appendChild(tagElement);
					firstSpan.appendChild(document.createTextNode(" "));
				}
			}
		}
		console.log("updated!");
	}

	// Start observing again
	observer.observe(document.body, { childList: true, subtree: true });
};

let timeoutId = null;
// Debounced processItems function
function debouncedProcessItems() {
	clearTimeout(timeoutId);
	timeoutId = setTimeout(processItems, 50);
}

const observer = new MutationObserver(debouncedProcessItems);

// Start observing the document with the configured parameters
observer.observe(document.body, { childList: true, subtree: true });
console.log("Loaded!");
