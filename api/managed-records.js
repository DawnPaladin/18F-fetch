import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

// Your retrieve function plus any additional functions go here ...
function retrieve(options = {}) {
	// set option defaults
	if (!options.page) options.page = 1;
	if (!options.colors) options.colors = [];
	
	// build query URL
	const pageLength = 10;
	const offset = (options.page - 1) * pageLength;
	let url = URI(window.path).addSearch("limit", pageLength).addSearch("offset", offset);
	
	// add colors
	options.colors.forEach(color => {
		url = URI(url).addSearch("color[]", color)
	});
	
	// fetch data from API
	fetch(url).then(response => {
		return response.json();
	}).then(data => {
		console.log(data);
	})
	const promise = new Promise((resolve, reject) => {
		resolve()
	})
	return promise;
}
retrieve({page: 2, colors: ["red", "green"]});

export default retrieve;
