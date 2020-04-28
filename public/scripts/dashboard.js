var Months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var DaysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var colors = ['#ff7e75', '#ffc875', '#758aff', '#75ccff', '#fa75ff','#b575ff', '#7577ff', '#ffa175', '#ff759e', '#9375ff'];
var times = ["8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM" , "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM"]

var weekDates;
var currentDay;
var classData;

var agenda = [];


//execution
server();
setCurrentDay();
setWeekDates();
setTableHeader();
showDate();
setClassColors();

function setClassColors(){
	for(var i =0; i < $(".blocks").length; i++){
		$(".blocks").slice(i, i+1).css('background', colors[i]);
	}
}


function buildAgenda(){
	for(var i =0; i<7; i++){
		var format = {
			tableCell: "",
			date: "",
			classes: []
		}

		format.tableCell = $(".week-agenda .th-space").slice(i, i+1);
		format.date = $(".week-agenda .th-space .date")[i].textContent;

		classData.forEach(function(o){
			Object.entries(o.days).forEach(function(day){
				if((day[0] == $(".week-agenda .th-space .day")[i].textContent.toLowerCase()) && day[1]){
					format.classes.push(o);
				}
			})
		});
		agenda.push(format);
	}
}

function updateAgenda(dayEvents){
	$(".today .updated-info").empty();

	$(".today .agenda-date")[0].textContent = dayEvents.date;

	var sortedClasses = sortClasses(dayEvents.classes);

	sortedClasses.forEach(function(o){
		$(".today").append(`<div class='updated-info'><div class="class">
	<div class="row">
		<div class="col">
			<h2><span class="time">` + o.time.startHour + ':' + o.time.startMinute + ' ' + o.time.startAMPM  + `</span></h2>
		</div>
	</div>
	<div class="row truncate">
		<h1 class='hide-overflow'><span class="course-name hide-overflow">` + o.name +`</span></h1>
	</div>
	<div class="row">
		<div class="col-sm-11">
			<h3 class='hide-overflow'><span class="location">` + o.location +`</span></h3>
		</div>
	</div>
	<div class="row">
		<div class="col-sm-11">
			<h3 class='hide-overflow'><span class="instructor">` + o.instructor +`</span></h3>
		</div>
	</div>
	<div class="row">
		<div class="col">
			<h2><span class="time">` + o.time.endHour + ':' + o.time.endMinute + ' ' + o.time.endAMPM  + `</span></h2>
		</div>
	</div>
</div></div>`).hide().show(100);
	})
		

	// });
}


function sortClasses(classData){
	var returnClasses = classData;

	for(var i =0; i <returnClasses.length; i++){
		var startTimeRO = convertToMilitary(returnClasses[i].time.startHour, returnClasses[i].time.startMinute, returnClasses[i].time.startAMPM);	
		for(var j =0; j <classData.length; j++){
			var startTime = convertToMilitary(classData[j].time.startHour, classData[j].time.startMinute, classData[j].time.startAMPM);

			if(startTimeRO < startTime){
				var temp = returnClasses[j];
				returnClasses[j] = classData[i];
				returnClasses[i] = temp;
			}
		}
	}
	return returnClasses;
}


function convertToMilitary(hour, minute, AMPM){
	if(parseInt(minute) < 10){
		minute = '0' + minute;
	}

	if(AMPM == 'PM'){
		return (parseInt(hour) + 12) + "" + minute;
	}else{
		if(parseInt(hour) === 12){
			hour = '00';
		}else if (parseInt(hour) < 10){
			hour = '0' + hour;
		}
		return hour + "" + minute;
	}
}

$(".left-section .week-agenda .th-space").click(function(){
	var boxClicked = $(this);
	agenda.forEach(function(item){
		if(item.tableCell[0].textContent == boxClicked[0].textContent){
			showSelectedWeekDay(item);
			updateAgenda(item);
		}
	});
})


function showTimes(){
	times.forEach(function(time){
		$(".today table tbody").append(`<tr>` + `<th>` + time + `</th>` + `</tr>`);
	});
}


function showAssignmentss(){
	var classes = getClassData();
	var ct = 0;

	classes.forEach(function(o){
		o.assignments.forEach(function(assignment){
			var dueDate = assignment.dueDate.split("/");
			var dueMonth = parseInt(dueDate[0]) -1;
			var dueYear = parseInt(dueDate[2])
			var dueDay = parseInt(dueDate[1]);

			for(var i =0; i<$(".week-agenda .th-space .day").length; i++){
				if(weekDates[i].getDate() == dueDay && weekDates[i].getMonth() === dueMonth && weekDates[i].getFullYear() === dueYear){
					$(".week-agenda .th-space").slice(i, i+1).append(`<div class='assignment-data ` + o._id+ `'><p class='assignment-name'>` + assignment.name + `</p></div>`);
				}
			}
		});

		$(".week-agenda ." + o._id).css('background', colors[ct]);

		ct++

	});
}

function getClassData(){
	return classData;
}

function showDate(){
	var date = new Date();
	var buildDate = DaysOfWeek[date.getDay()] + ', ' + Months[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear();
	$(".week-agenda #date")[0].textContent = buildDate;
}

function setCurrentDay(){
	var date = new Date();
	currentDay = date.getDay();
}

function setTableHeader(){
	for(var i =0; i < $(".week-agenda .th-space").length; i++){
		if(currentDay + i <7){
			$(".week-agenda .th-space .day")[i].textContent = DaysOfWeek[currentDay +i];
		}else{
			$(".week-agenda .th-space .day")[i].textContent = DaysOfWeek[currentDay +i -7];
		}
		var buildDate = Months[weekDates[i].getMonth()] + " " + weekDates[i].getDate()

		$(".week-agenda .th-space .date")[i].textContent = buildDate;

	}
}

function setWeekDates(){
	var todays_date = new Date();
	var thisWeekDates = [];

	varDaysinMonth = numOfDaysInMonth(todays_date.getFullYear(), todays_date.getMonth());

	thisWeekDates.push(todays_date);

	var ctnewYear =1;
	var ctnewMonth =1;

	for(var i =1; i<7; i++){
		if(todays_date.getDate() + i <= varDaysinMonth && todays_date.getMonth()<=11){
			thisWeekDates.push(new Date(todays_date.getFullYear(), todays_date.getMonth(), todays_date.getDate() + i));
		}else if(todays_date.getDate() + i > varDaysinMonth && todays_date.getMonth()===11){
			thisWeekDates.push(new Date(todays_date.getFullYear() +1, todays_date.getMonth() -11, ctnewYear));
			ctnewYear++;
		}else if((todays_date.getDate() + i > varDaysinMonth) && todays_date.getMonth()<11){
			thisWeekDates.push(new Date(todays_date.getFullYear(), todays_date.getMonth() + 1, ctnewMonth));
			ctnewMonth++;
		}
	}

	weekDates = thisWeekDates;
}

function numOfDaysInMonth(year, month){
	for(var i =1; i<33; i++){
		var date = new Date(year, month, i);

		if (date.getMonth() !== month){
			return i-1;
		}
	}
}



function server(){
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
    		setClassData(this.responseText);
    		showAssignmentss();
    		buildAgenda();
    		showSelectedWeekDay(agenda[0]);
    		updateAgenda(agenda[0]);
    	}
  	}

  	xhttp.open("GET","http://localhost:3000/calendar/semesterData", true);
   	xhttp.send();

}

function showSelectedWeekDay(dayBox){
	agenda.forEach(function(item){
		if (item.tableCell.slice(0,1).hasClass('selected')){
			item.tableCell.slice(0,1).removeClass('selected')
		}
	});

	dayBox.tableCell.slice(0,1).addClass('selected');
}

function setClassData(classTextData){
	classData = JSON.parse(classTextData);
}

function getClassData(){
	return classData;
}

$(".dropdown").click(function(e){
	var classContent = $(this).parent().next();
	if(classContent.is(":visible")){
		classContent.hide("fast", "linear");
	}else{
		classContent.show("fast", "linear");
	}
});