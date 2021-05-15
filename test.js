




function get_time_diff(url){ //get the time difference in ms between current time and the time from a time api
	current_time = new Date.now()
	let requested_time;
	$.ajax(
		url,
		dataType: "text",
		async: false,
		success: (time) => {
			requested_time = time
		});
	return requested_time - current_time;
}

