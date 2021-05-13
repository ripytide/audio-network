let audio_url;
let play_at;
let volume;
let audio_playing = "";
let audio;

let interval = 5000; //time between time checks
let poll_interval = 5000; //time between polls

setInterval(Poll, poll_interval);

setInterval(Check_play(), interval);

function Check_play(){
	audio.volume = volume
	if (play_at < 0) { //play_at will be negative as a signal to pause
		audio.pause();
	} else if (Get_time() > play_at){
		Play();
	}
}

function Poll(){
	$.ajax({
		url: "HandleNodePoll.php",
		success: Poll_returned,
		type: "POST",
		dataType: "json",
	});
}

function Poll_returned(json){
	//update log
	let log = document.getElementById("log");
	log.value += "\nLast polled at: " + json["last_polled"];

	audio_url = json["audio_url"];
	play_at = json["play_at"];
	volume = json["volume"];
}

function Play(){
	if (audio_url == playing_audio){
		audio.play();
	} else {
		audio = new Audio(audio_url);
		audio.play();
		playing_audio = audio_url;
	}
}
