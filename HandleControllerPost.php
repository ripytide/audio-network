<?php

if ($_SERVER["REQUEST_METHOD"] === "POST"){
	require_once("functions.php");
  
	Query("UPDATE nodes SET audio_url=?,play_at=?,volume=? WHERE name=?", "ssss", $_POST("audio_url"), $_POST("play_at"), $_POST("volume"), $_POST("name"));
}
?>
