function Send_change(){ //get the time difference in ms between current time and the time from a time api
	$.ajax({
		url: "HandleTimeController.php",
		type: "POST"
	});
}
