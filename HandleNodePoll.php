<?php

if ($_SERVER["REQUEST_METHOD"] === "POST"){
	require_once("functions.php");
  
	//get relevant row from the database for the correct node
	$node = Query("SELECT * FROM nodes WHERE name=?", "s", $name);

	if ($node->num_rows === 0){
		//insert new node into database
		Query("INSERT INTO nodes (name, last_polled, play_at, volume, playing) values(?, ?, -1, 0, false)", "ss", $_POST["name"], time());

    } else{
        $output = $node->fetch_assoc();

		//update data
		Query("UPDATE nodes SET last_polled=?,playing=?,audio_changed=false WHERE name=?", "sss", time(), $_POST["playing"], $_POST["name"]);
    }

  
  
    
	//send back info as json
	echo(json_encode($output));
}
?>
