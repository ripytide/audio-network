<?php

if ($_SERVER["REQUEST_METHOD"] === "POST"){
	require_once("functions.php");
  
	Query("UPDATE nodes SET audio_url=?,play_at=?,volume=?,audio_changed=? WHERE name=?", "sssss", $_POST["audio_url"], $_POST["play_at"], $_POST["volume"], $_POST["audio_changed"], $_POST["name"]);
}
	echo(Query("SELECT * FROM ?", "s", "nodes")->fetch_assoc());
?>
