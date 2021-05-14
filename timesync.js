//api's for ms since epoch
//https://currentmillis.com/time/minutes-since-unix-epoch.php
//checky.uk version:
//GetTime.php




let times = [];

for (let i=0; i<20; i++){
	times.push(get_time_diff("GetTime.php");
}





let plot_settings = {
	x: times,
	type: "box"
};

$(window).on("load", function(){
	Plotly.newPlot("box_plot", [plot_settings]);
});

function get_time_diff(url){ //get the time difference in ms between current time and the time from a time api
	current_time = new Date.now()
	let requested_time;
	$.ajax(
		url,
		dataType: "text",
		async: false
		success: (time) => {
			requested_time = time
		});
	return requested_time - current_time;
}




