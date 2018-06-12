var express = require("express"),
 	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose")

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//schema
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
// 	{
// 		name: "Granite", 
// 		image:"http://www.americansouthwest.net/new_mexico/photographs700/aguirre-hill.jpg"
// 	},function(err, campground){
// 		if(err){
// 			console.log(err);
// 		}else{
// 			console.log("newly created campground:");
// 			console.log(campground);
// 		}
// 	});


app.get("/", function(req,res){
	res.render("landing");
});

app.get("/campgrounds", function(req,res){
	//get all campgrounds from db
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds", {campgrounds: allCampgrounds});
		}
	});
});

app.post("/campgrounds", function(req,res){
	//get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name:name, image:image}
	//create a new campground and save to db
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds"); 
		}
	});
});

app.get("/campgrounds/new", function(req,res){
	res.render("new");
});

var port = process.env.PORT || 3000;
app.listen(3000, function(){
	console.log("App listening on port " + port);
});