<?php

if ($_SERVER["REQUEST_METHOD"] === "POST"){
	require_once("functions.php");
  
  //get name from session
  session_start();
	$name = $_SESSION["name"];
	session_commit();

  //update the last_polled column for the node
  Query("UPDATE nodes SET last_polled=? WHERE name=?", "ss", round(microtime(true) * 1000), $name);
  
	//get relevant row from the database for the correct node
	$node = Query("SELECT * FROM nodes WHERE name=?", "s", $name);
  
  if ($node->num_rows === 0){
        $output["error_msg"] = "no tasks for that checklist";
    } else{
        $output = $node->fetch_assoc();
    }
    
  //send back info as json
	echo(json_encode($output));
}
?>
