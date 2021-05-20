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
		audio.onended = function(){playing=false;$("#playing").text("Not Playing...")};
		changed = false;
		allow_play = true;
	}
	
	audio.volume = volume;
	
	if (play_at < 0) { //play_at will be negative as a signal to pause
		audio.pause();
		playing = false;
		$("#playing").text("Not Playing...");
		
	} else if (Get_time() > play_at && allow_play) { //time to play and allow_play used to stop looping
		audio.play();
		playing = true;
		allow_play = false;
		$("#playing").text("Playing");
	}
}

function Get_time(){
	return Date.now();
}

function Poll(){
	$.ajax({
		url: "HandleNodePoll.php",
		success: Poll_returned,
		type: "POST",
		data: {name, playing},
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
