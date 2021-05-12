<?php


if ($_SERVER["REQUEST_METHOD"] === "GET"){
		
		$nodes = Query("SELECT * FROM nodes", "", "");

        if ($nodes->num_rows === 0){
            $output["error_msg"] = "no tasks for that checklist";
        } else{
            while($row = $nodes->fetch_assoc()){
                $output["nodes"][] = $row;
            }
		}
		echo("test");
		echo(json_encode($output));
}

function Connect(){
    $db_servername = "localhost";
    $db_username = "root";
    $db_password = "";
    $dbname = "";

    // Create connection
    $conn = new mysqli($db_servername, $db_username, $db_password, $dbname);

    //check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    return $conn;
}

function Query($statement, $types, ...$variables){
    $conn = Connect();

    //prepare, bind and execute the statement
    $stmt = $conn->prepare($statement);
    $stmt->bind_param($types, ...$variables);
    $stmt->execute();

    $result = $stmt->get_result();

    //close connection
    $stmt->close();
    $conn->close();

    return $result;
}


?>
