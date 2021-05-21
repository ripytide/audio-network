<?php

if ($_SERVER["REQUEST_METHOD"] === "POST"){
	require_once("functions.php");

	//insert new node into database
	Query("INSERT INTO nodes (name, last_polled, play_at, volume, audio_url) values(?, ?, -1, 0, ?)", "sss", $_POST["name"], time(), "");
}
?>
