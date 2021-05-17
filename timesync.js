//api's for ms since epoch
//https://currentmillis.com/time/minutes-since-unix-epoch.php
//checky.uk version:
//GetTime.php

async function Start_pinging(){
	let time_diffs = [];
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
			size: 1
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
	}
	
	let number_of_pings = document.getElementById("number_of_pings").value;
	let time_between_pings = document.getElementById("number_of_pings").value;

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

});


let changed = false;
let switch_at;
function Poll(){
	$.ajax({
		url: "HandleNodePoll.php",
		success: (data) => {
			changed = data.changed;
			switch_at = data.switch_at;
		}
		type: "POST",
		dataType: "json",
	});
} 

function Check(){
	if (changed) {
		Off();
	if (Get_time() > switch_at) { //time to switch
		On();
	}
}

function Off(){
	document.getElementByTagName("BODY").style.background = "red";
}
function On(){
	document.getElementByTagName("BODY").style.background = "green";
}

let current_checking;
function Start_checking(){
	clearTimeout(current_checking);
	current_checking = setTimeout(Check, document.getElementById("time_interval"));
}

function Update_stats(times1){
	document.getElementById("mean-1").innerHTML = ss.mean(times1).toFixed(2);
	document.getElementById("median-1").innerHTML = ss.median(times1);
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
		}
	});

	return parseInt(requested_time) - time_before
}
