<?php

if ($_SERVER["REQUEST_METHOD"] === "POST"){
	require_once("functions.php");
	//insert new node into database
	Query("INSERT INTO nodes (name, last_polled) values(?, GETDATE())", "s", $_POST["name"]);
	echo("done");
}
?>
