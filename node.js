function Poll(){
  $.post(
    "HandlePoll.php",
    {},
    Poll_returned,
    "json"
    );
}

function Poll_returned(node){
  console.log(node);
}
  
  
setInterval(Poll, 5000);