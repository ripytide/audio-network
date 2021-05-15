console.log("hi");
//api's for ms since epoch
//https://currentmillis.com/time/minutes-since-unix-epoch.php
//checky.uk version:
//GetTime.php





$(window).on("load", function(){

	let times = [];

	let ping_count = document.getElementById("ping_count");
	for (let i=0; i<20; i++){
		new_time_diff = get_time_diff("GetTime.php");
		console.log(new_time_diff)
		times.push(new_time_diff);
		ping_count.innerHTML = i;
		
	}


	let plot_settings = {
		x: times,
		type: "box",
		boxpoints: "all",
		jitter: 0.2,
		pointpos: -2,
	};

	
	Plotly.newPlot("box_plot", [plot_settings]);
});


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

	console.log("server: " + time_after);
	console.log("client: " + time_before);

	return time_after - time_before
}
