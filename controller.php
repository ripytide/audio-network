<?php


if ($_SERVER["REQUEST_METHOD"] === "GET"){
		
		$nodes = Connect()->query("SELECT * FROM nodes");

        if ($nodes->num_rows === 0){
            $output["error_msg"] = "no tasks for that checklist";
        } else{
            while($row = $nodes->fetch_assoc()){
                $output["nodes"][] = $row;
            }
		}
		echo(json_encode($output));
}


function Register(){

}
?>
