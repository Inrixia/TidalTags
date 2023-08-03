let requestIds = new Set();
const requestItems = {};
let Authorization = "";

// Use async/await to get data from chrome.storage.sync
(async () => {
	const data = await new Promise((resolve) => chrome.storage.sync.get({ stringSetting: "" }, resolve));
	Authorization = data.stringSetting;
})();

chrome.storage.onChanged.addListener((changes, area) => {
	if (changes.stringSetting) {
		Authorization = changes.stringSetting.newValue;
	}
});

chrome.webRequest.onBeforeRequest.addListener(
	async function (details) {
		if (Authorization === "") return;
		// Check if the request has been resent
		if (requestIds.has(details.url)) {
			console.log("This request was resent by the extension.", requestItems[details.url]);
			sendItems(requestItems[details.url]);
			return;
		}

		const weWant = details.url.includes("/pages/album") || details.url.includes("/favorites/tracks");
		console.log(details.url, weWant);

		// Check if the method of the request is GET
		if (details.method === "GET" && weWant) {
			console.log("A request has been made:", details.url, weWant);
			// Add the request id to the Set of resent requests
			requestIds.add(details.url);

			try {
				const response = await fetch(details.url, {
					method: details.method,
					headers: {
						Authorization,
					},
				});

				// Check if the response is JSON
				const contentType = response.headers.get("content-type");
				if (contentType && contentType.includes("application/json")) {
					const data = await response.json();
					const items = searchForKey(data, "mediaMetadata");
					requestItems[details.url] = items.filter((item) => item.album !== undefined);
					sendItems(requestItems[details.url]);
				}
			} catch (error) {
				console.error("Error:", error);
			}
		}
	},
	{ urls: ["https://listen.tidal.com/*"] }
);

function sendItems(items) {
	if (!items) return;
	// Send a message to the content script
	chrome.tabs.query({ active: true, currentWindow: true, url: "https://listen.tidal.com/*" }, function (tabs) {
		// tabs is an array of tabs that match the query
		var activeTab = tabs[0];
		if (activeTab) {
			chrome.tabs.sendMessage(activeTab.id, { data: items }, function (response) {
				if (chrome.runtime.lastError) {
					console.error(chrome.runtime.lastError.message);
				} else {
					console.log(response);
				}
			});
		}
	});
}

function searchForKey(obj, key) {
	let result = [];
	function recursiveSearch(input) {
		if (typeof input !== "object" || input === null) return;

		if (input.hasOwnProperty(key)) result.push(input);
		Object.values(input).forEach(recursiveSearch);
	}

	recursiveSearch(obj);
	return result;
}
