<?php

if ($_SERVER["REQUEST_METHOD"] === "POST"){
	require_once("functions.php");
  
	//get relevant row from the database for the correct node
	$node = Query("SELECT * FROM nodes WHERE name=?", "s", $_POST["name"]);

	$output = $node->fetch_assoc();
	//send back info as json
	echo(json_encode($output));

	//update data
	Query("UPDATE nodes SET last_polled=?,playing=?,audio_changed=false WHERE name=?", "sss", time(), $_POST["playing"], $_POST["name"]);
}
?>
