var express 		= require("express"),
    app     		= express(),
    mongoose		= require('mongoose'),
    passport		= require('passport'),
    LocalStrategy	= require('passport-local'),
    bodyParser		= require('body-parser'),
    methodOverride  = require('method-override');



var User 			= require("./models/user"),
	Semester		= require("./models/semester"),
	Assignment      = require("./models/newAssignment");



//Mongoose random things
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//connect to mongoose, change PASSWORD in the future (before GITHUB)
mongoose.connect("mongodb+srv://keefmanjack:simple@firstdatabase-bdxnh.mongodb.net/Profecient?retryWrites=true&w=majority");

//passport configuration
app.use(require("express-session")({
	secret: "I want a cat",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended:true}));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});


app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public')); //for js scripts
app.use(methodOverride("_method"));


app.get("/", function(req, res){
	res.render("landing");
});

//login and signup routes
app.get("/signup", function(req, res){
	res.render("signup");
});

app.post("/signup", function(req, res){
	
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			res.redirect("back");
		}
		passport.authenticate('local')(req, res, function(){
			res.redirect("/home");
		});
	});
 });

app.get("/login", function(req, res){
	res.render("login");
});

app.post("/login", passport.authenticate("local", {
	successRedirect: "/home",
	failureRedirect: "back"
}), function(req, res){

});


var weekDays = ['Mon.', 'Tues.', 'Wed.', 'Thurs.', 'Fri.', 'Sat.', 'Sun.'];
app.get("/home", isLoggedIn, function(req, res){

	Semester.find({})
		.populate({
			path: 'classes.assignments'
		})
		.exec(function(err, allSemesters){
			if(err){
				console.log(err);
			}else{
				res.render("home", {semesters: allSemesters, weekDays: weekDays});
			}
	});
});

app.get("/newsemester", isLoggedIn, function(req, res){
	res.render("newsemester");
});

app.post("/newsemester", isLoggedIn, function(req, res){

	
	var semesterID;
	var newSemester = {
		name: req.body.semesterName,
		student: {
			id: req.user._id,
			username: req.user.username
		},
		classes: createClasses(req.body)
	};

	Semester.create(newSemester, function(err, newlyCreatedSemester){
			if(err){
				console.log(err);
			}else{
				res.redirect("/home");
			}
		});
});

//cRud Classes

app.get("/class/:id", isLoggedIn, function(req, res){
	Semester.findOne({'classes._id': req.params.id})
		.populate({
			path: 'classes.assignments'
		})
		.exec(function(err, foundSemester){
			if(err){
				console.log(err);
				res.redirect("back");
			}else{
				foundSemester.classes.forEach(function(queryClass){
					if(queryClass._id == req.params.id){
						res.render("showClass", {classData: queryClass, weekDays: weekDays});
					}
				});
			}
		});
});

//crUd Classes  ****Add checkauthorization
app.get("/semester/:id/update", isLoggedIn, function(req, res){
	Semester.findOne({'classes._id': req.params.id}, function(err, foundSemester){
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			res.render("updateClass", {semesterData: foundSemester, weekDays: weekDays});
		}
	});
});

app.put("/semester/:id", function(req, res){
	var updatedSemester = {
		name: req.body.semesterName,
		student: {
			id: req.user._id,
			username: req.user.username
		},
		classes: createClasses(req.body)
	};

	Semester.findByIdAndUpdate(req.params.id, updatedSemester, function(err, foundSemester){
		if(err){
			console.log(err);
		}else{
			
			res.redirect("/home");
		}
	});
});

function preserveAssignments(classes, updatedSem){
	for(var i =0; i < updatedSem.classes.length; i++){
		updatedSem.classes[i].assignments = classes[i].assignments;
	}

	return updatedSem;
}

//cruDClasses
app.delete("/semester/:id", function(req, res){
	Semester.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/home");
		}
	});
});

//Assignment Creation
app.get("/class/:id/Assignment/new", isLoggedIn, function(req, res){
	Semester.findOne({'classes._id': req.params.id}, function(err, foundSemester){
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			foundSemester.classes.forEach(function(queryClass){
				if(queryClass._id == req.params.id){
					res.render("createAssignment", {classData: queryClass});
				}
			});
			
		}
	});
});

app.post("/class/:id/Assignment/new", isLoggedIn, function(req, res){
	Semester.findOne({'classes._id': req.params.id}, function(err, foundSemester){
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			Assignment.create(req.body.assignment, function(err, newAssignment){
				if(err){
					console.log(err);
					res.redirect("back");
				}else{
					newAssignment.student.id = req.user._id;
					newAssignment.student.username = req.user.username;

					newAssignment.save();
					foundSemester.classes.forEach(function(queryClass){
						if(queryClass._id == req.params.id){
							queryClass.assignments.push(newAssignment);
						}
					});
					
					foundSemester.save();
					res.redirect("/class/" + req.params.id);
				}
			})	
		}
	});
});

// class/5e96679e43a3138642ca872d/Assignment/5e96735943a3138642ca8731/edit

app.get("/class/:id/Assignment/:assignment_id/edit", isLoggedIn, function(req, res){
	Semester.findOne({'classes._id': req.params.id}, function(err, foundSemester){
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			Assignment.findById(req.params.assignment_id, function(err, foundAssignment){
				if(err){
					console.log(err);
					res.redirect("back")
				}else{
					foundSemester.classes.forEach(function(queryClass){
						if(queryClass._id == req.params.id){

	
							res.render("updateAssignment", {classData: queryClass, assignmentData: foundAssignment});
						}
					});
				}
			});			
		}
	});
});

app.put("/class/:class_id/Assignment/:assignment_id", isLoggedIn, function(req, res){
	Assignment.findByIdAndUpdate(req.params.assignment_id, req.body.assignment, function(err, updatedAssignment){
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			res.redirect("/class/" + req.params.class_id);
		}
	});
});

app.delete("/class/:class_id/Assignment/:assignment_id/", isLoggedIn, function(req, res){
	Assignment.findByIdAndRemove(req.params.assignment_id, function(err){
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			res.redirect("/class/" + req.params.class_id);
		}
	});
});

function findClass(theSemester, theId){
	theSemester.classes.forEach(function(queryClass){
		if(queryClass._id == theId){
			return queryClass;
		}
	});
}


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect("/login");
};

function createClasses(body){
	var classes = [];
	var newClass = {};
	if(Array.isArray(body.class.name)){
		for(var i =0; i < body.class.name.length; i++){
			newClass =
				{
					name: body.class.name[i],
					instructor: body.class.instructor[i],
					location: body.class.location[i],
					days : createWeek(body.class, i),
					time: createTime(body.class, i),
					assignments: [{}]
				};
			classes.push(newClass);
		}
		return classes;
	}else{
		return body.class;
	}
}

function createWeek(body, i){
	newWeek =
	{
		monday: body.days.monday[i],
		tuesday: body.days.tuesday[i],
		wednesday: body.days.wednesday[i],
		thursday: body.days.thursday[i],
		friday: body.days.friday[i],
		saturday: body.days.saturday[i],
		sunday: body.days.sunday[i]

	};
	return newWeek;
}

function createTime(body, i){
	newTime =
		{
		startHour: body.time.startHour[i],
		startMinute: body.time.startMinute[i],
		startAMPM: body.time.startAMPM[i],
		endHour: body.time.endHour[i],
		endMinute: body.time.endMinute[i],
		endAMPM: body.time.endAMPM[i]
		};
	return newTime;
}

app.listen(3000, 'localhost', function(){
	console.log("Server started on port 3000");
});