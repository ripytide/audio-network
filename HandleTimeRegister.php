<?php

if ($_SERVER["REQUEST_METHOD"] === "POST"){
	require_once("functions.php");

	//insert new node into database
	Query("INSERT INTO timesync (name) values(?)", "s", $_POST["name"]);
?>
