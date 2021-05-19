<?php

if ($_SERVER["REQUEST_METHOD"] === "POST"){
	require_once("functions.php");
  
	//get relevant row from the database for the correct node
	$node = Query("SELECT * FROM nodes WHERE name=?", "s", $name);
	//update the last_polled column for the node
	Query("UPDATE nodes SET last_polled=?,playing=?,audio_changed=false WHERE name=?", "sss", time(), $_POST["playing"], $_POST["name"]);
  
  
	if ($node->num_rows === 0){
		$output["error_msg"] = "no tasks for that checklist";
    } else{
        $output = $node->fetch_assoc();
    }
    
	//send back info as json
	echo(json_encode($output));
}
?>
