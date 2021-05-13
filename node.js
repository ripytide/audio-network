function Poll(){
  $.post(
    "HandlePoll.php",
    {},
    Poll_returned,
    "json"
    );
}

function Poll_returned(json){
  console.log(json);
}
  
  
setInterval(Poll, 5000);
