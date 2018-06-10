var express = require("express");
var app = express();






var port = process.env.PORT || 3000;
app.listen(3000, function(){
	console.log("App listening on port " + port);
});