import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

/**
 * Provide information about a page of 10 color records. 
 * Specify the colors you're interested in. The server will
 * provide a paginated list, which you can fetch a page at a time.
 * 
 * Example usage:
 * retrieve({ colors: ["red", "yellow"], page: 1 }).then(colorPageSummary => console.log(colorPageSummary))
 * 
 * @param {Object} [options] - Options object (optional)
 * @param {Array.string} [options.colors] - Colors you wish to retrieve
 * @param {number} [options.page] - Page number
 * @returns {Promise<Object>} a promise to return an object with these properties:
 * ids: An array of the IDs of all the color records on this page.
 * open: An array of all the color records on this page that were open.
 * closedPrimaryCount: The number of closed color records that were primary (red, blue, or yellow).
 * previousPage: Page number of the previous page (or null if this is the first page).
 * nextPage: Page number of the next page (or null if this is the last page).
 */
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

// Sample usage:
// retrieve({ page: 5, colors: ["brown"]}).then(colorPageSummary => console.log(colorPageSummary))

export default retrieve;
