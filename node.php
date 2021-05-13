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

		<!-- Hand made style sheet -->
		<link href="styles.css" rel="stylesheet" />

		<title>Audio node</title>
	</head>
	<body>
		<script src="node.js"></script>
	
		<h1><?php echo($name); ?></h1>
		<form action="HandleRegister.php" method="POST">
			<label for="name">Name:</label>
			<input name="name" type="text"></input>
			<button type="submit">submit</button>
		</form>
	</body>
</html>