var silent = [] //[{name: "1620943094", pingTime: "1620834542", volume: 1, song: "/audio/axel.ogg", playSince: null}, {name: "test3", pingTime: "1620834542", volume: 0.8, song: "/audio/axel.ogg", playSince: null}]
var playing = [] //[{name: "as", pingTime: "1620834542", playSince: "1620834542", song: "/audio/axel.ogg", volume: 0.4}]
//var time_delay = 2
var countdowns = []
setInterval(function() {
   if (!countdowns.length) return
   for (var i=0; i < silent.length+playing.length; i++) {
      if (countdowns[i][1] < Date.now()) {
         document.getElementById('cd' + countdowns[i][0]).innerHTML == ''
         countdowns.splice(i, 1)
         continue
      }
      if (!document.getElementById('cd' + countdowns[i][0])) continue
      document.getElementById('cd' + countdowns[i][0]).innerHTML = Math.floor((countdowns[i][1]-Date.now())/1000)
   }
}, 0)

function mass_song_change(audio) {
   nodes = silent.concat(playing)
   for (var node of nodes) {
      document.getElementById('a' + node.name).value = audio
   }
   update_songs()
}

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
   document.getElementById("nodes").innerHTML = "<tr><td><b>Node name</b></td><td><b>Playing</b></td><td><b></b></td><td><b>Song URL</b></td><td><b>Volume</b></td><td><b>Countdown</b></td></tr>"
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
      if (data[i].playing) document.getElementById("nodes").innerHTML += "<tr><td>" + data[i].name + "</td><td>Yes</td><td></td><td><input type='checkbox' id='p" + data[i].name + "'></input></td><td><input type='text' value='" + data[i].song + "' id='a" + data[i].name + "'></input></td><td><td><input id='v" + data[i].name + "' value='" + Math.sqrt(data[i].volume)*100 + "' onclick=\"volume_update('v" + data[i].name + "')\" type='range' min='0' max='100'></td><td>" + formatTime(data[i].playSince) + "</td><td><span id ='cd" + data[i].name + "'></span></td></tr>"
      else document.getElementById("nodes").innerHTML += "<tr><td>" + data[i].name + "</td><td>No</td><td></td><td><input type='checkbox' id='s" + data[i].name + "'></input></td><td><input type='text' value='" + data[i].song + "' id='a" + data[i].name + "'></input></td><td><input id='v" + data[i].name + "' value='" + Math.sqrt(data[i].volume)*100 + "' onclick=\"volume_update('v" + data[i].name + "')\" type='range' min='0' max='100'></td><td><span id ='cd" + data[i].name + "'></span></td></tr>"
   }
}

function volume_update(computer) {
   var volume = document.getElementById(computer).value/100
   computer = computer.slice(1)
   log_update("Set volume of " + computer + " to  " + volume)
   var nodes = silent.concat(playing)
   var send = []
   for (var node of nodes) {
      if (node.name == computer) var object = {play_at: node.playSince.toString(), audio_url: node.song, name: node.name, audio_changed: 0, volume: volume**2}
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
      var object = {volume: node.volume, name: node.name, audio_changed: 1, play_at: (Number(Get_time())+Number(document.getElementById('time_delay').value)).toString(), audio_url: document.getElementById('a' + node.name).value}
      send.push(object)
      countdowns.push([node.name, Number(document.getElementById('time_delay').value)*1000+Number(Date.now())])
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
      var object = {volume: node.volume, name: node.name, audio_changed: 1, play_at: '-1', audio_url: document.getElementById('a' + node.name).value}
      send.push(object)
   }
   send_data(send)
}

function update_songs() {
   var computers = []
   for (var i=0; i < playing.length; i++) {
      if (document.getElementById('a' + playing[i].name).value != playing[i].song) computers.push(playing[i].name)
   }
   if (!computers.length) return
   log_update("Send songs update to server: " + JSON.stringify(computers))
   var nodes = silent.concat(playing)
   var send = []
   for (var node of nodes) {
      if (computers.indexOf(node.name) == -1) continue
      var object = {volume: node.volume, name: node.name, audio_changed: 1, play_at: (Number(Get_time())+Number(document.getElementById('time_delay').value)).toString(), audio_url: document.getElementById('a' + node.name).value}
      send.push(object)
   }
   send_data(send)
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
   console.log(silent)
   playing = newData[1]
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
}, 5000)

function Poll_returned(nodes) {
   console.log(performance.now())
   console.log(nodes)
   if (nodes.error_msg) {
      if (nodes.error_msg == "no nodes") {
         console.log("no nodes")
	 updateData([[],[]])
         return
      }
      else {
         console.log(nodes.error_msg)
         return
      }
   }
   var silent_temp = []
   var playing_temp = []
   for (var node of nodes.nodes) {
      var new_node = {playSince: Number(node.play_at), name: node.name, volume: node.volume, song: node.audio_url, playing: node.playing != 0}
      if (node.playing == 0) silent_temp.push(new_node)
      else playing_temp.push(new_node)
   }
   console.log(silent_temp)
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
