function Poll(){
  $.post(
    "HandlePoll.php",
    {},
    Poll_returned,
    "json"
    );
}

function Poll_returned(){
  console.log(json);
}
  
  
setInterval(Poll, 5000);
