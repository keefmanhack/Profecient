var express 			= require("express"),
    app     			= express(),
    mongoose			= require('mongoose'),
    passport			= require('passport'),
    LocalStrategy		= require('passport-local'),
    bodyParser			= require('body-parser'),
    methodOverride  	= require('method-override');

var indexRoutes			= require("./routes/index"),
	semesterRoutes		= require("./routes/semester"),
	assignmentRoutes	= require("./routes/assignments");

var User 				= require("./models/user"),
	Semester 			= require("./models/semester");



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

app.use(indexRoutes);
app.use("/class/:class_id/Assignment/", assignmentRoutes);
app.use(semesterRoutes);

app.get("/calendar", function(req, res){
	res.render("index/calendar");
});

app.get("/calendar/semesterData", function(req, res){
	Semester.find({}).populate({path: 'classes.assignments'}).exec(function(err, foundSemesters){
		if(err){
			console.log(err);
		}else{
			res.send(foundSemesters[0].classes);
		}
	})
	
});


app.listen(3000, 'localhost', function(){
	console.log("Server started on port 3000");
});