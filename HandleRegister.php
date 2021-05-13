<?php

if ($_SERVER["REQUEST_METHOD"] === "POST"){
	require_once("functions.php");

	//insert new node into database
	Query("INSERT INTO nodes (name, last_polled, play_at, volume) values(?, ?, -1, 0)", "ss", round(microtime(true) * 1000), $_POST["name"]);

	//store name in session
	session_start();
	$_SESSION["name"] = $_POST["name"];
	session_commit();

	//redirect to active node page
	header("Location: node.php");
}
?>
