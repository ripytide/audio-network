var silent = [{name: "test", pingTime: "1620834542398"}, {name: "test3", pingTime: "1620834542398"}]
var playing = [{name: "test2", pingTime: "1620834542398", playSince: "1620834542398", song: "/audio/axel.ogg"}]

function updateTables() {
   // ran whenever computers are changed/added/whatever
   document.getElementById("nodes").innerHTML = ""
   var data = silent.concat(playing)
   data.sort((a,b) => {
      let fa = a.name.toLowerCase(),
         fb = b.name.toLowerCase();
      if (fa < fb) {
         return -1;
      }
      if (fa > fb) {
         return 1;
      }
      return 0;
   })
   for (var i=0; i < data.length; i++) {
      if (data[i].playSince) document.getElementById("nodes").innerHTML += "<tr><td>" + data[i].name + "</td><td>Yes</td><td><a href='javascript:beep(\"p" + data[i].name + "\")'>Beep</a></td><td><input type='checkbox' id='p" + data[i].name + "'></input></td><td><input type='text' value='" + data[i].song + "' id='pa" + data[i].name + "'></input></td><td>" + formatTime(data[i].playSince) + "</td></tr>"
      else document.getElementById("nodes").innerHTML += "<tr><td>" + data[i].name + "</td><td>No</td><td><a href='javascript:beep(\"s" + data[i].name + "\")'>Beep</a></td><td><input type='checkbox' id='s" + data[i].name + "'></input></td><td><input type='text' value='/audio/axel.ogg' id='sa" + data[i].name + "'></input></td></tr>"
   }
}

function beep(computerName) {
   // send data to server
}

function start_playing() {
   var computers = []
   for (var i=0; i < silent.length; i++) {
      if (document.getElementById('s' + silent[i].name).checked) computers.push([silent[i], document.getElementById('sa' + silent[i].name).value])
   }
   console.log(computers)
   // send data to server
}

function stop_playing() {
   var computers = []
   for (var i=0; i < playing.length; i++) {
      if (document.getElementById('p' + playing[i].name).checked) computers.push(playing[i])
   }
   console.log(computers)
   // send data to server
}

function update_songs() {
   var computers = []
   for (var i=0; i < playing.length; i++) {
      if (document.getElementById('pa' + playing[i].name).value != playing[i].song) computers.push([playing[i], document.getElementById('pa' + playing[i].name).value])
   }
   console.log(computers)
   // send data to server
}

function updateData(newData) { // for when the server sends shit
   var tableUpdate = false
   if (newData[0].length != silent.length || newData[1].length != playing.length) tableUpdate = true
   else {
      for (var i=0; i < silent.length; i++) {
         if (silent[i].name != newData[0][i].name) tableUpdate = true
      }
      for (var i=0; i < playing.length; i++) {
         if (playing[i].name != newData[1][i].name || playing[i].song != newData[1][i].song || playing[i].playSince != newData[1][i].playSince) tableUpdate = true
      }
   }
   silent = newData[0]
   playing = newData[1]
   console.log(tableUpdate)
   if (tableUpdate) updateTables()
}

function formatTime(time) {
   var date = new Date(Number(time))
   return date.getHours() + ":" + ("0" + date.getMinutes()).substr(-2) + ":" + ("0" + date.getSeconds()).substr(-2) + ":" + ("0" + date.getMilliseconds()).substr(-3)
}
updateTables()
function Poll() {
   $.post(
      "HandleControllerPoll.php",
      {},
      Poll_returned,
      "json"
      );
}

function Poll_returned(nodes) {
   console.log(nodes)
}
