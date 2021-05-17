<?php
require_once("functions.php");

$result = Query("SELECT change_at, changed FROM timesync WHERE name=?", "s", "all");

$output = $result->fetch_assoc();

echo(json_encode($output);

?>
