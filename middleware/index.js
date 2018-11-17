//all the middleware
var middlewareObj = {},
    Campground = require("../models/campground"),
    Comment = require("../models/comment");

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    //using the connect-flash dependency
    //under key "error", we add the value "Please..." which will show up in the header
    req.flash("error", "Please, Login First!");
    res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err){
                req.flash("error", "Campground not found");
                res.redirect("back"); //back to the previous page
            }else{
                if(!foundCampground){
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                //does user own the campground?
                //check if the author id = the user id
                if(foundCampground.author.id.equals(req.user._id)){
                   next();
                }else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "Please Login First!");
        res.redirect("back"); 
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
                res.redirect("back"); //back to the previous page
            }else{
                //does user own the comment?
                //check if the author id = the user id
                if(foundComment.author.id.equals(req.user._id)){
                   next();
                }else{
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "Please, login first!")
        res.redirect("back"); 
    }
}

module.exports = middlewareObj;