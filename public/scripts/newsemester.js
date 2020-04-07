const courseName = "Course Name";

var newClass = $("form button:contains(New Class)");
var complete = $("form button:contains(Complete)");

// var text ="<hr>
// 	<input type=text name=class[name] placeholder=Course Name>
// 	<input type=text name=class[instructor] placeholder=Instructor>
// 	<input type=text name=cs[location] placeholder=Location>
// 	<div>
// 		<input type=checkbox name=days[monday]>
// 		<label>Monday</label>
// 		<input type=checkbox name=days[tuesday]>
// 		<label>Tuesday</label>
// 		<input type=checkbox name=days[wednesday]>
// 		<label>Wednesday</label>
// 		<input type=checkbox name=days[thursday]>
// 		<label>Thursday</label>
// 		<input type=checkbox name=days[friday]>
// 		<label>Friday</label>
// 		<input type=checkbox name=days[saturday]>
// 		<label>Saturday</label>
// 		<input type=checkbox name=days[sunday]>
// 		<label>Sunday</label>
// 	</div>
// 	<label>Start Time</label>
// 	<input type=number min=1 max=12 name=time[startHour]>
// 	<label>:</label>
// 	<input type=number min=0 max=60 name=time[startMinute]>
// 	<select name=time[startAMPM]>
// 		<option value=AM>AM</option>
// 		<option value=PM>PM</option>
// 	</select>
// 	<label>End Time</label>
// 	<input type=number min=1 max=12 name=time[endHour]>
// 	<label>:</label>
// 	<input type=number min=0 max=60 name=time[endMinute]>
// 	<select name=time[endAMPM]>
// 		<option value=AM>AM</option>
// 		<option value=PM>PM</option>
// 	</select>"

newClass.click(function(){
	$("form").append("<hr>");
	$("form").append("<input type=text name=class[name] placeholder=" + courseName +">");
	$("form").append("<input type=text name=class[instructor] placeholder=Instructor>");
	$("form").append("<input type=text name=class[location] placeholder=Location>");
	$("form").append("<div>");
		$("div:last").append("<input class=check type=checkbox value=true name=days[monday]>");
		$("div:last").append("<input class=hid type=hidden value=false name=days[monday]>");
		$("div:last").append("<label>Monday</label>");
		$("div:last").append("<input class=check type=checkbox value=true name=days[tuesday]>");
		$("div:last").append("<input class=hid type=hidden value=false name=days[tuesday]>");
		$("div:last").append("<label>Tuesday</label>");
		$("div:last").append("<input class=check type=checkbox value=true name=days[wednesday]>");
		$("div:last").append("<input class=hid type=hidden value=false name=days[wednesday]>");
		$("div:last").append("<label>Wednesday</label>");
		$("div:last").append("<input class=check type=checkbox value=true  name=days[thursday]>");
		$("div:last").append("<input class=hid type=hidden value=false  name=days[thursday]>");
		$("div:last").append("<label>Thursday</label>");
		$("div:last").append("<input class=check type=checkbox value=true name=days[friday]>");
		$("div:last").append("<input class=hid type=hidden value=false name=days[friday]>");
		$("div:last").append("<label>Friday</label>");
		$("div:last").append("<input class=check type=checkbox value=true name=days[saturday]>");
		$("div:last").append("<input class=hid type=hidden value=false name=days[saturday]>");
		$("div:last").append("<label>Saturday</label>");
		$("div:last").append("<input class=check type=checkbox value=true name=days[sunday]>");
		$("div:last").append("<input class=hid type=hidden value=false name=days[sunday]>");
		$("div:last").append("<label>Sunday</label>");
	$("form").append("<label>Start Time</label>");
	$("form").append("<input type=number min=1 max=12 name=time[startHour]>");
	$("form").append("<label>:</label>");
	$("form").append("<input type=number min=0 max=60 name=time[startMinute]>");
	$("form").append("<select name=time[startAMPM]>");
		$("select:last").append("<option value=AM>AM</option>");
		$("select:last").append("<option value=PM>PM</option>");
	$("form").append("</select>");
	$("form").append("<label>End Time</label>");
	$("form").append("<input type=number min=1 max=12 name=time[endHour]>");
	$("form").append("<label>:</label>");
	$("form").append("<input type=number min=0 max=60 name=time[endMinute]>");
	$("form").append("<select name=time[endAMPM]>");
		$("select:last").append("<option value=AM>AM</option>");
		$("select:last").append("<option value=PM>PM</option>");
	$("form").append("</select>");
});

$("form").submit(function(){
	var checkboxes = $(".check");
	var hiddenboxes = $(".hid");

	for(var i =0; i< checkboxes.length; i++){
		console.log('for');
		if(checkboxes[i].checked){
			console.log("checkbox");
			hiddenboxes[i].remove();
		}else{
			console.log("hid");
			checkboxes[i].remove();
		}
	}
});

$(".weekday").on("click", function(){
	$(this).toggleClass("weekdayselected");
	$(this).removeClass("weekdayhover");
});

$(".weekday").on("mouseenter", function(){
	$(this).addClass("weekdayhover");
});	

$(".weekday").on("mouseout", function(){
	$(this).removeClass("weekdayhover");
});

