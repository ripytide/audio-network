
let audio_url;
let play_at;
let volume;
let playing = false;

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
  audio_url = json["node"]["audio_url"];
  bits = json["node"]["play_at"].split("-");
  
  play_at = new Date(bits[0], bits[1] - 1, bits[2].substr(0,2))
  volume = json["node"]["volume"];
}

function date_sql_js(date){
  let year = date.split("-")[0]
  let month = date.split("-")[1] - 1
  let day = date.split("-")[0].substr(0,2)
  let hour = date.split(":")[0].substr(-3, -1)
  let minute = date.split(":")[1]
  let second = date.split(":")[2]
}
setInterval(Poll, 5000);

while (true){
  let curr_date = new Date();
  
  if (play_at < curr_date && curr_date > new Date()
  
  if date.get

}

  

