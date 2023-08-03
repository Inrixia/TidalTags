let requestIds = new Set();
const requestItems = {};

chrome.webRequest.onBeforeRequest.addListener(
	function (details) {
		// Check if the request has been resent
		if (requestIds.has(details.url)) {
			console.log("This request was resent by the extension.", requestItems[details.url]);
			sendItems(requestItems[details.url]);
			return;
		}

		const weWant = details.url.includes("/pages/album") || details.url.includes("/favorites/tracks");

		// Check if the method of the request is GET
		if (details.method === "GET" && weWant) {
			console.log("A request has been made:", details.url, weWant);
			// Add the request id to the Set of resent requests
			requestIds.add(details.url);
			// Resend the request
			fetch(details.url, {
				method: details.method,
				headers: {
					Authorization: "",
				},
			})
				.then((response) => {
					// Check if the response is JSON
					const contentType = response.headers.get("content-type");
					if (contentType && contentType.includes("application/json")) {
						return response.json();
					} else {
						return null;
					}
				})
				.then((data) => {
					if (data === null) return;
					const items = searchForKey(data, "mediaMetadata");
					requestItems[details.url] = items.filter((item) => item.album !== undefined);
					sendItems(requestItems[details.url]);
				})
				.catch((error) => console.error("Error:", error));
		}
	},
	{ urls: ["https://listen.tidal.com/*"] }
);

function sendItems(items) {
	if (items === undefined || items === null) return;
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
		if (typeof input !== "object" || input === null) {
			return;
		}

		if (input.hasOwnProperty(key)) {
			result.push(input);
		}

		Object.values(input).forEach((value) => {
			recursiveSearch(value);
		});
	}

	recursiveSearch(obj);
	return result;
}
