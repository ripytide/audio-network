let audio_url = "random starting url"
let play_at;
let volume;
let current_audio;
let audio;
let playing = false;

let interval = 5000; //time between time checks
let poll_interval = 5000; //time between polls

setInterval(Poll, poll_interval);

setInterval(Check_play(), interval);

function Check_play(){
	audio.volume = volume;

	if (audio_url != current_audio) { //if the audio_url has changed then make a new audio object
		audio = new Audio(audio_url)
		audio.onended = function(){playing=false};
		current_audio = audio_url;
	}
	
	if (play_at < 0) { //play_at will be negative as a signal to pause
		audio.pause();
	}
	
	} else if (Get_time() > play_at) { //time to play
		audio.play();
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
	
	//update variables from poll
	audio_url = json["audio_url"];
	play_at = json["play_at"];
	volume = json["volume"];
}
