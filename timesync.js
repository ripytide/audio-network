//api's for ms since epoch
//https://currentmillis.com/time/minutes-since-unix-epoch.php
//checky.uk version:
//GetTime.php


let number_of_pings = 100
let time_between_pings = 500





$(window).on("load", async function(){
	let times = [];
	let data = {
		x: times,
		type: "box",
		boxpoints: "all",
		jitter: 0.2,
		pointpos: -2,
	};
	let layout = {};
	Plotly.newPlot("box_plot", [data], layout);

	for (let i=0; i<number_of_pings; i++){
		new_time_diff = get_time_diff("GetTime.php");
		times.push(new_time_diff);
		data.x = times;
		layout.datarevision = i;
		Plotly.react("box_plot", [data], layout);
		Update_stats(times);

		await new Promise(r => setTimeout(r, time_between_pings));
	}

});

function Update_stats(times){
	return 2;
}


function get_time_diff(url){ //get the time difference in ms between current time and the time from a time api
	time_before = Date.now()
	let requested_time;
	
	$.ajax({
		url,
		dataType: "text",
		async: false,
		success: (time) => {
			time_after = time
		}
	});

	return time_after - time_before
}
