import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

// Your retrieve function plus any additional functions go here ...
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
	fetch(url).then(response => {
		return response.json();
	}).then(data => {
		
		// Determine whether there's another page of results
		const nextPage = data.splice(10);
		const nextPageNum = nextPage.length > 0 ? pageNum + 1 : null;
		
		console.log(pageNum, data, nextPageNum);
		
		const output = {
			ids: [],
			open: [],
			closedPrimaryCount: 0,
			previousPage: pageNum === 1 ? null : pageNum - 1,
			nextPage: nextPageNum,
		}
	}).catch(error => {
		console.log("Network error:", error);
	})
	
	const promise = new Promise((resolve, reject) => {
		resolve()
	})
	return promise;
}
retrieve({page: 10, colors: ["red"]});
retrieve({page: 11, colors: ["red"]});
retrieve({page: 12, colors: ["red"]});

export default retrieve;
