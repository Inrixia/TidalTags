const requestIds = new Set();
const requestItems: Record<string, Item[]> = {};

let Authorization = "";

// Restore the saved setting when the options page loads
chrome.storage.local.get("Authorization", (data) => (Authorization = data?.Authorization ?? ""));

const tdl = "https://listen.tidal.com/*";

chrome.webRequest.onBeforeRequest.addListener(
	// @ts-expect-error Dont care the browser will take a promise without worry
	async (details) => {
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
						Authorization: Authorization,
					},
				});

				// Check if the response is JSON
				const contentType = response.headers.get("content-type");
				if (contentType && contentType.includes("application/json")) {
					const data = await response.json();
					const items = searchForKey(data, "mediaMetadata");
					requestItems[details.url] = items.filter((item) => item.album !== undefined && item.mediaMetadata.tags.length > 1);
					sendItems(requestItems[details.url]);
				}
			} catch (error) {
				console.error("Error:", error);
			}
		}
	},
	{ urls: [`${tdl}pages/album*`, `${tdl}favorites/tracks*`, `${tdl}pages/home*`, `${tdl}playlists/*/items*`, `${tdl}pages/mix*`, `${tdl}pages/artist*`] }
);

const sendItems = (data: unknown[]) => {
	if (data === undefined) return;
	if (data.length === 0) return;
	// Send a message to the content script
	chrome.tabs.query({ active: true, currentWindow: true, url: tdl }, ([activeTab]) => {
		if (activeTab.id) chrome.tabs.sendMessage(activeTab.id, { data });
	});
};

const searchForKey = (obj: unknown, key: string): Item[] => {
	let result: Item[] = [];
	const recursiveSearch = (input: unknown) => {
		if (typeof input !== "object" || input === null) return;

		if (input.hasOwnProperty(key)) result.push(<Item>input);
		Object.values(input).forEach(recursiveSearch);
	};
	recursiveSearch(obj);
	return result;
};
