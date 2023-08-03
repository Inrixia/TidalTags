const itemsToProcess = {};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	for (const item of request.data) {
		itemsToProcess[item.id] ??= item;
	}
	processItems();
	sendResponse();
});

// Cache class name and text content pairs to reduce lookup time
const tagData = {
	MQA: { className: "tag tag-mqa", textContent: "MQA" },
	HIRES_LOSSLESS: { className: "tag tag-hr", textContent: "HiRes" },
	DOLBY_ATMOS: { className: "tag tag-atmos", textContent: "Atmos" },
};

const processItems = () => {
	// Stop observing
	observer.disconnect();

	for (const key in itemsToProcess) {
		const item = itemsToProcess[key];

		// Cache the querySelectorAll result
		const firstSpan = document.querySelector(`span[data-id='${item.id}']`);

		if (firstSpan) {
			// Initialize originalText with currentText if it's not already defined
			item.originalText ??= firstSpan.textContent;

			if (firstSpan.textContent === item.originalText) {
				// Using documentFragment to minimize browser reflow
				const fragment = document.createDocumentFragment();

				for (const tag of item.mediaMetadata.tags) {
					if (tag === "LOSSLESS") continue;

					const data = tagData[tag];
					if (!data) continue;

					const tagElement = document.createElement("span");
					tagElement.className = data.className;
					tagElement.textContent = data.textContent;

					fragment.appendChild(tagElement);
					fragment.appendChild(document.createTextNode(" "));
				}
				firstSpan.appendChild(fragment);
			}
		}
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
