<?php

require_once("functions.php");

Query("DELETE FROM nodes WHERE last_polled<?", "i", time() - 60);

?>
