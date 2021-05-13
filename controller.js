var silent = [{name: "test", pingTime: "1620834542398"}, {name: "test2", pingTime: "1620834542398"}]
var playing = [{name: "test3", pingTime: "1620834542398", playSince: "1620834542398", song: "/audio/axel.ogg"}]

function updateTables() {
   // ran whenever computers are changed/added/whatever
   for (var i=0; i < silent.length; i++) {
      document.getElementById("silent").innerHTML += "<tr><td>" + silent[i].name + "</td><td><a href='javascript:beep(\"s" + i + "\")'>Beep</a></td><td><input type='checkbox' id='s" + i + "'></input></td><td><input type='text' value='/audio/axel.ogg' id='sa" + i + "'></input></td></tr>"
   }
   for (var i=0; i < playing.length; i++) {
      document.getElementById("playing").innerHTML += "<tr><td>" + playing[i].name + "</td><td>" + formatTime(playing[i].playSince) + "</td><td><a href='javascript:beep(\"p" + i + "\")'>Beep</a></td><td><input type='checkbox' id='p" + i + "'></input></td><td><input type='text' value='" + playing[i].song + "' id='pa" + i + "'></input></td></tr>"
   }
}

function beep(computerID) {
   if (computerID.startsWith('s')) var computer = silent[computerID.substring(1)]
   else var computer = playing[computerID.substring(1)]
   console.log(computer)
   // send data to server
}

function startPlaying() {
   var computers = []
   for (var i=0; i < silent.length; i++) {
      if (document.getElementById('s' + i).checked) computers.push([silent[i], document.getElementById('sa' + i).value])
   }
   console.log(computers)
   // send data to server
}

function stopPlaying() {
   var computers = []
   for (var i=0; i < playing.length; i++) {
      if (document.getElementById('p' + i).checked) computers.push(playing[i])
   }
   console.log(computers)
   // send data to server
}

function updateSongs() {
   var computers = []
   for (var i=0; i < playing.length; i++) {
      if (document.getElementById('pa' + i).value != playing[i].song) computers.push([playing[i], document.getElementById('pa' + i).value])
   }
   console.log(computers)
   // send data to server
}

function updateData(newData) { // for when the server sends shit
   var tableUpdate = false
   //if (newData[0].length != 
}

function formatTime(time) {
   var date = new Date(Number(time))
   return date.getHours() + ":" + ("0" + date.getMinutes()).substr(-2) + ":" + ("0" + date.getSeconds()).substr(-2) + ":" + ("0" + date.getMilliseconds()).substr(-3)
}
updateTables()
