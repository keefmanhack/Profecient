var colors = ['#ff7e75', '#ffc875', '#758aff', '#75ccff', '#fa75ff','#b575ff', '#7577ff', '#ffa175', '#ff759e', '#9375ff'];

var Months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var DaysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var currentMonth;
var currentYear;
var classData;

server();
initializeCalendar();

function showCalendar(year, month){
	clearCalendar();

	//DATE INFORMATION
	var date = new Date(year, month, 1);
	var daysInThisMonth = numOfDaysInMonth(date.getFullYear(), date.getMonth());
	var previousMonthDays = date.getDay();
	var nextMonthDays = 6 - (new Date(date.getFullYear(), date.getMonth(), daysInThisMonth)).getDay();
	var totalDaysToShow = nextMonthDays + previousMonthDays + daysInThisMonth;
	var lastDayOfPreviousMonth;

	if(date.getMonth()-1 <0){
		lastDayOfPreviousMonth = numOfDaysInMonth(date.getFullYear(), 11);
	}else{
		lastDayOfPreviousMonth = numOfDaysInMonth(date.getFullYear(), date.getMonth()-1);
	}
	//END OF DATE INFORMATION
	
	var cols = 7;
	var rows = Math.floor(totalDaysToShow/7);
	var ct =1;
	var text = "";

	$(".calendar h1")[0].textContent = Months[date.getMonth()];
	$(".calendar h2")[0].textContent = date.getFullYear();

	for(var i =0; i< rows; i++){
		var rowText =[];
		for(var j =0; j<cols; j++){
			if (ct <= previousMonthDays){
				rowText.push(lastDayOfPreviousMonth-previousMonthDays+j +1);
			}else if (ct> (daysInThisMonth+previousMonthDays)){
				rowText.push(ct - daysInThisMonth - previousMonthDays);
			}else{
				rowText.push(ct-previousMonthDays);
			}
			ct++;
		}

		text = `<tr>`;
		for(var k =0; k<rowText.length; k++){
			text += `<th>` + `<span>` + rowText[k] + `</span>` + `</th>`;
		}

		text += `</tr>`;
  		$(".calendar tbody").append(text);
	}

	NotInMonth(); //grey out unused dates

	if(classData){
		showAssignments();
	}
}

//*************************
//CALENDAR HELPER FUNCTIONS
//*************************
function initializeCalendar(){
	var date = new Date();
	currentMonth = date.getMonth();
	currentYear = date.getFullYear();
	showCalendar(currentYear, currentMonth);
}

function numOfDaysInMonth(year, month){
	for(var i =1; i<33; i++){
		var date = new Date(year, month, i);

		if (date.getMonth() !== month){
			return i-1;
		}
	}
}

function clearCalendar(){
	$(".calendar tbody").empty();
}

function NotInMonth(){
	var firstLast = [];
	for(var i =0; i<$(".calendar tbody th").length; i++){
		if($(".calendar tbody th span")[i].textContent == 1){
			firstLast.push(i);
		}
	}

	if(firstLast[0] >0){
		$(".calendar tbody th").slice(0, firstLast[0]).addClass("muted");
	}
	if(firstLast[1]){
		$(".calendar tbody th").slice(firstLast[1], $(".calendar tbody th").length).addClass("muted");
	}
}

$(".calendar #month-back").click(function(){
	if(currentMonth-1 < 0){
		currentMonth = 11;
		currentYear--;
	}else{
		currentMonth--;
	}
	showCalendar(currentYear, currentMonth);
	
});

$(".calendar #month-next").click(function(){
	if(currentMonth+1 > 11){
		currentMonth = 0;
		currentYear++;
	}else{
		currentMonth++;
	}
	showCalendar(currentYear, currentMonth);
	
});

//*********
//Assignment work
//*********

function showAssignments(){
	var classes = getClassData();
	var ct = 0;

	//remove old legend
	$(".calendar .class-colors *").remove();


	classes.forEach(function(o){
		o.assignments.forEach(function(assignment){
			var dueDate = assignment.dueDate.split("/");
			var dueMonth = parseInt(dueDate[0]) -1;
			var dueYear = parseInt(dueDate[2])

			if (currentMonth === dueMonth && currentYear === dueYear){
				var dueDay = parseInt(dueDate[1]);

				for(var i =0; i<$(".calendar tbody th").length; i++){
					if(($(".calendar tbody th span")[i].textContent == dueDay) && !($(".calendar tbody th").slice(i, i+1).hasClass('muted'))){
						$(".calendar tbody th").slice(i, i+1).append(`<div ` + `class=` + o._id + `><p>` + assignment.name + `</p></div>`);
					}
				}
			}
		});

		$(".calendar ." + o._id).css('background', colors[ct]);

		//add Legend
		if(o.assignments.length >0){
			$(".calendar .class-colors").append(`<h3 style="background:` + colors[ct] + `">` + o.name +`</h3`);
		}
		


		ct++

	});

	attachAssignmentListeners(classes);
}

function attachAssignmentListeners(classes){
	$(".calendar tbody th div").click(function(){
		var foundAssignment;
		var foundClass;
		var assignmentName = $(this).text();

		classes.forEach(function(o){
			o.assignments.forEach(function(assignment){
				if(assignment.name == assignmentName){
					foundAssignment=assignment;
					foundClass = o;
				}
			});
		});

		$(".popup-info .assignment-name").text(foundAssignment.name);
		$(".popup-info .class-name").text(foundClass.name);
		$(".popup-info .due-time").text(foundAssignment.dueTime);
		$(".popup-info .description").text(foundAssignment.description);

		var editPath = "/class/" + foundClass._id + "/Assignment/" + foundAssignment._id + "/edit"; 
		var deletePath = "/class/" + foundClass._id + "/Assignment/" + foundAssignment._id + "/?_method=DELETE";
		var goToShowPagePath = "/class/" + foundClass._id;

		$(".popup-info .go-to-show-page").attr("href", goToShowPagePath);
		$(".popup-info .edit").attr("href", editPath);
		$(".popup-info .delete").attr("action", deletePath);
    	$(".popup-info").toggleClass("show");
	});
};

function server(){
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
    		setClassData(this.responseText);
    		showAssignments();
    	}
  	}

  	xhttp.open("GET","http://localhost:3000/calendar/semesterData", true);
   	xhttp.send();

}

function setClassData(classTextData){
	classData = JSON.parse(classTextData);
}

function getClassData(){
	return classData;
}

$("#exit").click(function(){
	if($(".popup-info").hasClass("show")){
		$(".popup-info").removeClass("show");
	}
});





