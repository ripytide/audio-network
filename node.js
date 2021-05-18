let audio_url = "random starting url"
let play_at;
let volume;
let audio = new Audio("");
let playing = false;
let audio_changed = false;

let interval = 5000; //time between time checks
let poll_interval = 5000; //time between polls

setInterval(Poll, poll_interval);

setInterval(Check_play(), interval);

function Check_play(){
	audio.volume = volume;

	if (audio_changed) { //if the audio_url has changed then make a new audio object
		audio = new Audio(audio_url)
		audio.onended = function(){playing=false};
		current_audio = audio_url;
		changed = false;
	}
	
	if (play_at < 0) { //play_at will be negative as a signal to pause
		audio.pause();
		playing = false;
		document.getElementById("playing").innerHTML = "Not Playing...";
		
	} else if (Get_time() > play_at) { //time to play
		audio.play();
		playing = true;
		document.getElementById("playing").innerHTML = "Playing: " + audio_url;
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
		data: {playing},
		dataType: "json",
	});
}

function Poll_returned(json){
	//update variables from poll
	audio_url = json["audio_url"];
	play_at = json["play_at"];
	volume = json["volume"];
	audio_changed = json["audio_changed"];
}
