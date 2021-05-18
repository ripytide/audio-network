<?php

require_once("functions.php");

Query("UPDATE timesync SET change_at=?, changed=true", "i", time() + 10);

?>
