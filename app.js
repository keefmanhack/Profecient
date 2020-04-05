var express 		= require("express"),
    app     		= express(),
    mongoose		= require('mongoose'),
    passport		= require('passport'),
    LocalStrategy	= require('passport-local'),
    bodyParser		= require('body-parser');



var User 			= require("./models/user"),
	Semester		= require("./models/semester");



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


app.get("/", function(req, res){
	res.render("landing");
});

app.get("/remove", function(req, res){
	Semester.remove({}, function(err){
		if(err){
			console.log(err);
		}else{
			console.log("Removed all semesters");
		}

	});

	Class.remove({}, function(err){
		if(err){
			console.log(err);
		}else{
			console.log("Removed all classes");
			res.redirect("/home");
		}

	});
})


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



app.get("/home", isLoggedIn, function(req, res){
	Semester.find({}, function(err, allSemesters){
		if(err){
			console.log(err);
		}else{
			console.log(allSemesters)
			res.render("home", {semesters: allSemesters});
		}
	});
});

app.get("/newsemester", isLoggedIn, function(req, res){
	res.render("newsemester");
});

app.post("/newsemester", isLoggedIn, function(req, res){
	//var ids = createClasses(req.body);
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
				console.log(newlyCreatedSemester);
			}
		});


	res.redirect("/home");
	
});

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
					location: body.class.location[i] 
				};
			classes.push(newClass);
		}
		return classes;
	}else{
		return body.class;
	}
}

app.listen(3000, 'localhost', function(){
	console.log("Server started on port 3000");
});