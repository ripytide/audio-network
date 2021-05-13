<?php
function Connect(){
    $db_servername = "localhost";
    $db_username = "u108222632_main";
    $db_password = "1234567890123456789012345678901234567890aA";
    $dbname = "u108222632_main";

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

	//echo error msg if there was one
	if (!$stmt = $conn->prepare($statement)){
		echo("SQL error: " . $conn->error);
	}

	$stmt->bind_param($types, ...$variables);

	$stmt->execute();

    $result = $stmt->get_result();

    //close connection
    $stmt->close();
    $conn->close();

    return $result;
}
?>
