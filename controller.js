var silent = [] //[{name: "1620943094", pingTime: "1620834542", volume: 1, song: "/audio/axel.ogg", playSince: null}, {name: "test3", pingTime: "1620834542", volume: 0.8, song: "/audio/axel.ogg", playSince: null}]
var playing = [] //[{name: "as", pingTime: "1620834542", playSince: "1620834542", song: "/audio/axel.ogg", volume: 0.4}]
var time_delay = 2

function Get_time(){//returns the current time in unix time
	let time;
	$.ajax({
		url: "https://showcase.api.linx.twenty57.net/UnixTime/tounixtimestamp?datetime=now",
		success: function(json){time=json["UnixTimeStamp"]},
		async: false
	});

	return time;
}		

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
      if (data[i].playSince) document.getElementById("nodes").innerHTML += "<tr><td>" + data[i].name + "</td><td>Yes</td><td></td><td><input type='checkbox' id='p" + data[i].name + "'></input></td><td><input type='text' value='" + data[i].song + "' id='a" + data[i].name + "'></input></td><td><td><input id='v" + data[i].name + "' onclick=\"volume_update('v" + data[i].name + "')\" type='range' min='0' max='100' value='100'></td><td>" + formatTime(data[i].playSince) + "</td></tr>"
      else document.getElementById("nodes").innerHTML += "<tr><td>" + data[i].name + "</td><td>No</td><td></td><td><input type='checkbox' id='s" + data[i].name + "'></input></td><td><input type='text' value='" + data[i].song + "' id='a" + data[i].name + "'></input></td><td><input id='v" + data[i].name + "' onclick=\"volume_update('v" + data[i].name + "')\" type='range' min='0' max='100' value='100'></td></tr>"
   }
}

function volume_update(computer) {
   var volume = document.getElementById(computer).value/100
   computer = computer.slice(1)
   log_update("Set volume of " + computer + " to  " + volume)
   var nodes = silent.concat(playing)
   var send = []
   for (var node of nodes) {
      if (node.name == computer) var object = {play_at: computer.playSince.toString(), audio_url: computer.song, name: node.name, audio_changed: false}
      else continue
      send.push(object)
   }
   send_data(send)
}

function start_playing() {
   var computers = []
   console.log(silent)
   for (var i=0; i < silent.length; i++) {
      console.log(document.getElementById('s' + silent[i].name))
      if (document.getElementById('s' + silent[i].name).checked) computers.push(silent[i].name)
   }
   console.log(computers)
   if (!computers.length) return
   log_update("Send songs to play to server: " + JSON.stringify(computers))
   var nodes = silent.concat(playing)
   var send = []
   for (var node of nodes) {
      if (computers.indexOf(node.name) == -1) continue
      var object = {volume: node.volume, name: node.name, audio_changed: true, play_at: (Number(Get_time())+time_delay).toString(), audio_url: document.getElementById('a' + node.name).value}
      send.push(object)
   }
   console.log(send)
   send_data(send)
}

function stop_playing() {
   var computers = []
   for (var i=0; i < playing.length; i++) {
      if (document.getElementById('p' + playing[i].name).checked) computers.push(playing[i].name)
   }
   if (!computers.length) return
   log_update("Send songs to stop to server: " + JSON.stringify(computers))
   var nodes = silent.concat(playing)
   var send = []
   for (var node of nodes) {
      if (computers.indexOf(node.name) == -1) continue
      var object = {volume: node.volume, name: node.name, audio_changed: true, play_at: '-1', audio_url: document.getElementById('a' + node.name).value}
      send.push(object)
   }
   send_data(send)
}

function update_songs() {
   var computers = []
   for (var i=0; i < playing.length; i++) {
      if (document.getElementById('pa' + playing[i].name).value != playing[i].song) computers.push([playing[i], document.getElementById('pa' + playing[i].name).value])
   }
   if (!computers.length) return
   log_update("Send songs update to server: " + JSON.stringify(computers))
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
         if (playing[i].name != newData[1][i].name || playing[i].song != newData[1][i].song || playing[i].playing != newData[1][i].playing) tableUpdate = true
      }
   }
   silent = newData[0]
   playing = newData[1]
   log_update("Tables were updated")
   if (tableUpdate) updateTables()
}

function formatTime(time) {
   var date = new Date(Number(time)*1000)
   return date.getHours() + ":" + ("0" + date.getMinutes()).substr(-2) + ":" + ("0" + date.getSeconds()).substr(-2) + ":" + ("00" + date.getMilliseconds()).substr(-3)
}

function log_update(str) {
   document.getElementById("logs").innerHTML = formatTime(Number(Get_time())) + " " + str + "<br></br>" + document.getElementById("logs").innerHTML
}

function Poll() {
   $.ajax({
      url: "HandleControllerPoll.php",
      data: {},
	   success: Poll_returned,
	type: "POST",
      dataType: "json"
	  });
}

Poll()

setInterval(function() {
   Poll()
}, 200)

function Poll_returned(nodes) {
   console.log(performance.now())
   console.log(nodes)
   var silent_temp = []
   var playing_temp = []
   for (var node of nodes.nodes) {
      var new_node = {playSince: Number(node.playAt), name: node.name, volume: node.volume, song: node.audio_url}
      if (new_node.playSince<=0) silent_temp.push(new_node)
      else playing_temp.push(new_node)
   }
   updateData([silent_temp, playing_temp])
}

function send_data(nodes) {
   for (var node of nodes) {
      $.ajax({
      url: "HandleControllerPost.php",
      data: node,
      success: function(){log_update('successlol')},
      type: "POST",
      dataType: "json"
      })
   }
}
