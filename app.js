var express = require("express"),
 	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	Campground = require("./models/campground"),
	seedDB = require("./seeds")

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

seedDB() //run function seedDB from seeds.js

app.get("/", function(req,res){
	res.render("landing");
});

//INDEX route: show all campgrounds
app.get("/campgrounds", function(req,res){
	//get all campgrounds from db
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("index", {campgrounds: allCampgrounds});
		}
	});
});

//CREATE route: add new campground
app.post("/campgrounds", function(req,res){
	//get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var newCampground = {name:name, image:image, description:description};
	//create a new campground and save to db
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds"); 
		}
	});
});

//NEW route: show form to create new campground
app.get("/campgrounds/new", function(req,res){
	res.render("new");
});

//SHOW route: show info about a specific dog
app.get("/campgrounds/:id", function(req,res){
	//find the campground with provided id
	//.populate will show the actual comment instead of its id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground);
			//render show template with that campground
			res.render("show", {campground: foundCampground});
		}
	});
});

var port = process.env.PORT || 3000;
app.listen(3000, function(){
	console.log("App listening on port " + port);
});