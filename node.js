let audio_url;
let play_at;
let volume;
let audio_playing = "";
let audio;

let interval = 5000; //time between time checks
let poll_interval = 5000; //time between polls


window.addEventListener('load', Main_loop);

function Poll(){
	$.ajax({
		url: "HandleNodePoll.php",
		success: Poll_returned,
		type: "POST",
		dataType: "json",
		async: false
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

function Get_time(){//returns the current time in unix time
	let time;
	$.ajax({
		url: "https://showcase.api.linx.twenty57.net/UnixTime/tounixtimestamp?datetime=now",
		success: function(json){time=json["UnixTimeStamp"]},
		async: false
	});

	return time;
}	

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
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

function Pause(){
	audio.pause();
}

setInterval(Poll, poll_interval);

function Main_loop(){
	while (true){
		audio.volume = volume
		if (play_at < 0) { //play_at will be negative as a signal to pause
			Pause();
		} else if (Get_time() > play_at){
			Play();
		}
		sleep(interval);
	}
}

