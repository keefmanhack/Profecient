const courseName = "Course Name";

var newClass = $("form button:contains(New Class)");


newClass.click(function(){
	$("form").append("<hr>")
	$("form").append("<input type=text name=class[name] placeholder=" + courseName +">");
	$("form").append("<input type=text name=class[instructor] placeholder=Instructor>");
	$("form").append("<input type=text name=class[location] placeholder=Location>")
})

	



