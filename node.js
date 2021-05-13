function Poll(){
  $.post(
    "HandleNodePoll.php",
    {},
    Poll_returned,
    "json"
    );
}

function Poll_returned(json){
  let log = document.getElementById("log");
  log.value += "\nLast polled at: " + json["node"]["last_polled"];
}
  
  
setInterval(Poll, 5000);
