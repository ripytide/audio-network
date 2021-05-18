<?php
session_start();
$name = $_SESSION["name"];
session_commit();
?>

<!DOCTYPE html>
<html lang="en">
	<head>
		<!-- Required meta tags -->
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		
		<!-- JQuery -->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

		<!-- Hand made style sheet -->
		<link href="styles.css" rel="stylesheet" />

		<title>Audio node</title>
	</head>
	<body>
		<script src="node.js"></script>
	
		<h1><?php echo($name); ?></h1>
		<button id="start_button" onclick="Start()">Start</button>
		<h1 id="status">Not started...</h1>
		<h1 id="playing"></h1>
		<form action="HandleRegister.php" method="POST">
			<label for="name">Name:</label>
			<input name="name" type="text"></input>
			<button type="submit">submit</button>
		</form>
	</body>
</html>
