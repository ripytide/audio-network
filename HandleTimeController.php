<?php

require_once("functions.php");

Query("UPDATE timesync SET change_at=?, changed=true WHERE name=?", "is", time() + 10, "all");

?>
