import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

function retrieve(options = {}) {
	// set option defaults
	if (!options.page) options.page = 1;
	if (!options.colors) options.colors = [];
	
	const pageNum = options.page;
	
	// build query URL
	const offset = (pageNum - 1) * 10;
	// Page length is 10, but we need to know if there's a next page, so we try to retrieve 11 at a time.
	let url = URI(window.path).addSearch("limit", 11).addSearch("offset", offset);
	
	// add colors
	options.colors.forEach(color => {
		url = URI(url).addSearch("color[]", color)
	});
	
	// fetch data from API
	return fetch(url).then(response => response.json()).then(data => {
		
		// Determine whether there's another page of results
		const nextPage = data.splice(10);
		const nextPageNum = nextPage.length > 0 ? pageNum + 1 : null;
		
		// Initialize output
		const output = {
			ids: [],
			open: [],
			closedPrimaryCount: 0,
			previousPage: pageNum === 1 ? null : pageNum - 1,
			nextPage: nextPageNum,
		};
		
		// Process records
		const primaryColors = ["red", "blue", "yellow"];
		data.forEach(row => {
			output.ids.push(row.id);
			row.isPrimary = primaryColors.includes(row.color);
			if (row.disposition === "open") {
				output.open.push(row);
			}
			if (row.disposition === "closed" && row.isPrimary) {
				output.closedPrimaryCount += 1;
			}
		})
		
		return output;
	}).catch(error => {
		console.log("Network error:", error);
	});
}

export default retrieve;
