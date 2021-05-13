<?php

if ($_SERVER["REQUEST_METHOD"] === "POST"){
	require_once("functions.php");
  
  $nodes = Connect()->query("SELECT * FROM nodes");
  
  //write nodes to nodes in output
  if ($nodes->num_rows === 0){
        $output["error_msg"] = "no nodes";
    } else{
          while($row = $nodes->fetch_assoc()){
               $output["nodes"][] = $row;
            }
    }
    
  //send back info as json
	echo(json_encode($output));
}
?>
