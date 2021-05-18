let time_diffs = [];
async function Start_pinging(){
	time_diffs = [];
	let time_means = [];
	let time_medians = [];
	let time_modes = [];
	let box_data = {
		type: "box",
		boxpoints: "all",
		jitter: 0.2,
		pointpos: -2,
		name: ""
	};
	let mean_data = {
		line: {
			width: 4
		},
		name: "Mean"
	}
	let median_data = {
		line: {
			width: 4
		},
		name: "Median"
	}
	let mode_data = {
		line: {
			width: 4
		},
		name: "Mode"
	}
	let histogram_data = {
		type: "histogram",
		xbins: {
			size: 4
		}
	}
	let box_layout = {
		title: "Time Diffs",
		xaxis: {
			title: "Time/ms"
		}
	};
	let line_layout = {
		title: "Time Diffs Averages over (Time)",
		xaxis: {
			title: "Total Pings"
		},
		yaxis: {
			title: "Time/ms"
		}
	};
	let histogram_layout = {
		title: "Time Diffs Histogram",
		bargap: 0.05,
		xaxis: {
			title: "Time/ms"
		},
		yaxis: {
			title: "Frequency"
		}
	}
	
	let number_of_pings = document.getElementById("ping_count_input").value;
	let time_between_pings = document.getElementById("time_between_pings").value;

	for (let i=0; i<number_of_pings; i++){
		let new_diff = get_time_diff("GetTime.php");
		time_diffs.push(new_diff)

		box_data.x = time_diffs;

		time_means.push(ss.mean(time_diffs));
		mean_data.x = [...Array(i).keys()];
		mean_data.y = time_means;

		time_medians.push(ss.median(time_diffs));
		median_data.x = [...Array(i).keys()];
		median_data.y = time_medians;

		time_modes.push(ss.mode(time_diffs));
		mode_data.x = [...Array(i).keys()];
		mode_data.y = time_modes;

		histogram_data.x = time_diffs;

		//these are necceccary for plotly.js to update its plots
		box_layout.datarevision = i;
		line_layout.datarevision = i;
		histogram_layout.datarevision = i;

		if (document.getElementById("update_graphs").checked) {
			Plotly.react("box_plot", [box_data], box_layout);
			Plotly.react("line_plot", [mean_data, median_data, mode_data], line_layout);
			Plotly.react("histogram_plot", [histogram_data], histogram_layout);
		}

		//updates the table
		Update_stats(time_diffs);

		await new Promise(r => setTimeout(r, time_between_pings));
	}

}


let changed = false;
let change_at;
let poll_count = 0;
function Poll(){
	$.ajax({
		url: "HandleTimePoll.php",
		success: (data) => {
			changed = data.changed;
			change_at = data.change_at;
		},
		type: "POST",
		data: {name},
		dataType: "json",
	});

	poll_count++;
	document.getElementById("poll_count").innerHTML = "Poll Count: " + poll_count;
	console.log("Changed: " + changed);
	console.log("change_at: " + change_at);
} 

function Check(){
	if (changed) {
		Off();
	}

	let time = Get_time();
	if (time > change_at) { //time to switch
		On();
	}

	document.getElementById("countdown").innerHTML = "Countdown: " + (change_at - time).toFixed(2);
}

function Off(){
	document.getElementsByTagName("BODY")[0].style.background = "red";
}
function On(){
	document.getElementsByTagName("BODY")[0].style.background = "green";
}

let current_checking;
let current_polling;
function Start_Checking(){
	Register();
	clearInterval(current_checking);
	clearInterval(current_polling);

	let interval = document.getElementById("time_interval").value;
	current_checking = setInterval(Check, interval);
	current_polling = setInterval(Poll, 3000);
}

function Update_stats(times1){
	document.getElementById("mean-1").innerHTML = ss.mean(times1).toFixed(2);
	document.getElementById("median-1").innerHTML = ss.median(times1);
	document.getElementById("mode-1").innerHTML = ss.mode(times1);
	document.getElementById("stan-1").innerHTML = ss.standardDeviation(times1).toFixed(2);
	document.getElementById("range-1").innerHTML = ss.max(times1) - ss.min(times1)
	document.getElementById("iq-range-1").innerHTML = ss.interquartileRange(times1).toFixed(2);
	
	document.getElementById("ping_count").innerHTML = "Ping count: " + times1.length;
}

function get_time_diff(url){ //get the time difference in ms between current time and the time from a time api
	time_before = Date.now()
	let requested_time;

	$.ajax({
		url,
		dataType: "text",
		async: false,
		success: (time) => {
			requested_time = time
		},
		type: "POST"
	});

	return parseInt(requested_time) - time_before
}


let time_offset = 0;
function Update_delay_mode(mode){
	switch (mode) {
		case "local":
			time_offset = 0;
			break;
		case "mean":
			time_offset = ss.mean(time_diffs);
			break;
		case "median":
			time_offset = ss.median(time_diffs);
			break;
		case "mode":
			time_offset = ss.mode(time_diffs);
			break;
		case "custom":
			time_offset = document.getElementById("custom_offset").value;
			break;
	}

	document.getElementById("time_offset").innerHTML = "Time Offset: " + time_offset;
}

function Get_time(){
	return (Date.now() - time_offset) / 1000;
}

let name;
function Register(){
	name = prompt("Please enter name: ");
	
	$.ajax({
		url: "HandleTimeRegister.php",
		type: "POST",
		data: {name},
		dataType: "json",
	});
} 
