//audio global variables
let audio_url = ""
let play_at = 0;
let volume = 0;
let audio = new Audio("");
let playing = false;
let audio_changed = false;
let allow_play = false;
let name;


//tweakables
let interval = 5000; //time between time checks
let poll_interval = 5000; //time between polls


function Start(){
	name = prompt("Please enter node name:");
	Register();
	$("#name").text("Node name: " + name);

	$("#status").text("Status: started!");
	$("#start_button").remove();

	setInterval(Poll, poll_interval);
	setInterval(Check_play, interval);
}

function Check_play(){
	if (audio_changed) { //if the audio_url has changed then make a new audio object
		audio = new Audio(audio_url)
		audio.onended = Pause;
		changed = false;
		allow_play = true;
	}
	
	audio.volume = volume;
	
	if (play_at < 0) { //play_at will be negative as a signal to pause

		
	} else if (Get_time() > play_at && allow_play) { //time to play and allow_play used to stop looping
		Play();
	}
}

function Play(){
	audio.play();
	playing = true;
	allow_play = false;
	$("#playing").text("Playing");
	document.getElementsByTagName("BODY")[0].style.background = "green";
}

function Pause(){
	audio.pause();
	playing = false;
	$("#playing").text("Not Playing...");
	document.getElementsByTagName("BODY")[0].style.background = "red";
}

function Poll(){
	let binary_playing = playing ? 1 : 0;
	$.ajax({
		url: "HandleNodePoll.php",
		success: Poll_returned,
		type: "POST",
		data: {name, playing: binary_playing},
		dataType: "json",
	});
}

function Poll_returned(json){
	//update variables from poll
	audio_url = json["audio_url"];
	$("#audio_url").text("Audio URL: " + audio_url);

	play_at = json["play_at"];
	$("#play_at").text("Play At: " + play_at);

	volume = json["volume"];
	$("#volume").text("Volume: " + volume);

	audio_changed = json["audio_changed"];
}

function Register(){
	$.ajax({
		url: "HandleNodeRegister.php",
		type: "POST",
		data: {name},
	});
}

let offset = 0;
function set_offset(){
	let ping_times = []
	const num = 500
	$("#find_offset").remove();
	for (let ping_count = 1; ping_count <= num; ping_count++){
		ping_times.push(get_time_diff("GetTime.php");
		$("#ping_status").text("Mode finding in progress: " + ping_count + "/" ping_total);
		$("#offset").text("Offset: " + ss.mode(ping_times));
	}
	offset = ss.mode(ping_times);
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

function Get_time(){
	return (Date.now() + offset) / 1000;
}
