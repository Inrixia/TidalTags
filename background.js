const requestIds = new Set();
const requestItems = {};

let Authorization = "";

chrome.storage.sync.get({ Authorization: "" }, (data) => {
	Authorization = data.Authorization;
});
chrome.storage.onChanged.addListener((changes) => {
	if (changes.Authorization) Authorization = changes.Authorization.newValue;
});

const tdl = "https://listen.tidal.com/*";

chrome.webRequest.onBeforeRequest.addListener(
	async function (details) {
		if (Authorization === "") return;
		// Check if the request has been resent
		if (requestIds.has(details.url)) {
			console.log("Using cached data...", details.url);
			return sendItems(requestItems[details.url]);
		}

		console.log("Fetching...", details.url);

		// Check if the method of the request is GET
		if (details.method === "GET") {
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
	{ urls: [`${tdl}pages/album*`, `${tdl}favorites/tracks*`, `${tdl}pages/home*`, `${tdl}playlists/*/items*`, `${tdl}pages/mix*`] }
);

const sendItems = (data) => {
	if (data === undefined) return;
	if (data.length === 0) return;
	// Send a message to the content script
	chrome.tabs.query({ active: true, currentWindow: true, url: tdl }, ([activeTab]) => {
		if (activeTab) chrome.tabs.sendMessage(activeTab.id, { data });
	});
};

const searchForKey = (obj, key) => {
	let result = [];
	const recursiveSearch = (input) => {
		if (typeof input !== "object" || input === null) return;

		if (input.hasOwnProperty(key)) result.push(input);
		Object.values(input).forEach(recursiveSearch);
	};
	recursiveSearch(obj);
	return result;
};
