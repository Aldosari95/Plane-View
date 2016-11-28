var users = require("../models/users.js")
/* 
 * This simple controller is to demonstrate the use of Passport.
 * There are two primary routes: 
 * 1) "/" - Does not require the user to authenticate (log in).
 * 2) "/membersOnly".  This does require autentication
 * And there are two supporting routes to log in and out (with obvious names).
 */

/* 
 * Initialize this controller
 * @param {Express} app - The Express app
 */
exports.init = function(app) {
  // app.js put the Passport object on the Express object so we could get it 
  // handily here.  Note that this form of app.get is NOT a route, rather it is
  // a getter to go along with a prior setter.
  var passport = app.get('passport');
  // Welcome page route
  app.all('/', index);
  /*
   * A route to display information only for members who are logged in
   * The first argument is the route pattern
   * The second argument is a middleware function to check if the user making
   *    the request has been authenticated.  If so, it will call the next
   *    middleware argument.  If not authenticated, it will res.render an eror.
   * The third argument is the middleware function to handle the membersOnly
   *    route.
   */
  app.get('/membersOnly',
          checkAuthentication,
          doMembersOnly);
  /*
   * A login route.
   * This route only uses the Passport middleware to authenticate the user.
   * It uses the 'local' authentication strategy (defined in 
   *    models/authentication.js).  Upon successful authentication, redirect
   *    the user to the /membersOnly route.  Upon failure to authenticate,
   *    redirect the user to the /login.html page.
   */
  app.post('/login',
          passport.authenticate('local', {
                                  failureRedirect: '/login.html',
                                  successRedirect: '/rating.html'}));
  // The Logout route
  app.get('/logout', doLogout);

  app.put('/newUser/:username/:password/:gender/:seat/:personality/:food', doNewUser);

  app.put('/newUser/:username/:password/:gender1/:gender2/:gender3/:seat1/:seat2/:seat3/:personality1/:personality2/:personality3/:food1/:food2/:food3', doNewUser2);

  app.get('/search/:gender/:personality', checkAuthentication, doSearch);

  app.get('/search/', checkAuthentication, doSearch2);

  app.get('/search/:username', doSearch3);

  app.get('/book/:username/:booking', doBooking);
}

// No path:  display the welcome page
index = function(req, res) {
  res.render('index');
};

// Members Only path handler
doMembersOnly = function(req, res) {
  // We only should get here if the user has logged in (authenticated) and
  // in this case req.user should be define, but be careful anyway.
  if (req.user && req.user.displayName) {
    // Render the membership information view
    res.render('membersInfo', {member: req.user.displayName});
  } else {
    // Render an error if, for some reason, req.user.displayName was undefined 
    res.render('error', { 'message': 'Application error...' });
  }
};

/*
 * Check if the user has authenticated
 * @param req, res - as always...
 * @param {function} next - The next middleware to call.  This is a standard
 *    pattern for middleware; it should call the next() middleware component
 *    once it has completed its work.  Typically, the middleware you have
 *    been defining has made a response and has not needed any additional 
 *    middleware.
 */
function checkAuthentication(req, res, next){
    // Passport will set req.isAuthenticated
    if(req.isAuthenticated()){
        // call the next bit of middleware
        //    (as defined above this means doMembersOnly)
        next();
    }else{
        // The user is not logged in. Redirect to the login page.
        res.redirect("/login.html");
    }
}

/* 
 * Log out the user
 */
function doLogout(req, res){
  // Passport puts a logout method on req to use.
  req.logout();
  // Redirect the user to the welcome page which does not require
  // being authenticated.
  res.redirect('/');
};

doNewUser = function(req, res){
  console.log("Starting newUser in dbRoutes");
  console.log(req.params);

  users.newUser ( req.params.username,
             req.params.password,
             req.params.gender,
             req.params.seat,
             req.params.personality,
             req.params.food,
             req.params.industry,
                      function(result) {
                        // result equal to true means create was successful
                        var success = (result ? "Create successful" : "Create unsuccessful");
                        res.end(success);
                        console.log("2. Done with callback in dbRoutes users create");
                      });
  console.log("3. Done with doNewUser in dbRoutes");
}

doNewUser2 = function(req, res){
  console.log("Starting newUser in dbRoutes");
  console.log(req.params);

  users.newUser2 ( req.params.username,
             req.params.password,
             req.params.gender1,
             req.params.gender2,
             req.params.gender3,
             req.params.seat1,
             req.params.seat2,
             req.params.seat3,
             req.params.personality1,
             req.params.personality2,
             req.params.personality3,
             req.params.food1,
             req.params.food2,
             req.params.food3,
                      function(result) {
                        // result equal to true means create was successful
                        var success = (result ? "Create successful" : "Create unsuccessful");
                        res.end(success);
                        console.log("2. Done with callback in dbRoutes users create");
                      });
  console.log("3. Done with doNewUser in dbRoutes");
}

doSearch = function(req, res){
  users.findByUsername(req.user.username, function(err, result){
    console.log("got user data");
    console.log(result);
    if(!err){
      users.search(req.params.gender, result["seat"], function(docs){
        console.log("searched");
        console.log(docs);
        temp1 = [];
        for(var i=0; i < docs.length; i++){
          if((docs[i]["personality"] == req.params.personality) && (docs[i]["food"] == result["food"])){
            temp1.push(docs[i]);
          }
        }
        temp2 = [];
        for(var i=0; i < docs.length; i++){
          if(docs[i]["personality"] == req.params.personality){
            temp2.push(docs[i]);
          }
        }
        temp3 = []
        for(var i=0; i < docs.length; i++){
          if(docs[i]["food"] == result["food"]){
            temp3.push(docs[i]);
          }
        }

        console.log("temp1");
        console.log(JSON.stringify(temp1[0]));
        console.log("temp2");
        console.log(JSON.stringify(temp2[0]));
        console.log("temp3");
        console.log(JSON.stringify(temp3[0]));

        if(temp1.length){
          res.end(JSON.stringify(temp1));
        }
        else if(temp2.length){
          res.end(JSON.stringify(temp2));
        }

        else if(temp3.length){
          res.end(JSON.stringify(temp3));
        }
        else{
          res.end(JSON.stringify(docs));
        }
      });
    }
  });
}


doSearch2 = function(req, res){
  users.findByUsername(req.user.username, function(err, result){
      console.log("got user data");
      console.log(result);
      var u_gender1 = result["gender1"];
      var u_gender2 = result["gender2"];
      var u_gender3 = result["gender3"];
      var u_seat1 = result["seat1"];
      var u_seat2 = result["seat2"];
      var u_seat3 = result["seat3"];
      var u_personality1 = result["personality1"];
      var u_personality2 = result["personality2"];
      var u_personality3 = result["personality3"];
      var u_food1 = result["food1"];
      var u_food2 = result["food2"];
      var u_food3 = result["food3"];

      var all_scores = {};

      users.getAll(function(docs){
        for(var i=0; i<docs.length; i++){
          if(req.user.username != docs[i]["username"]){
            var p_username = docs[i]["username"];
            var p_gender1 = docs[i]["gender1"];
            var p_gender2 = docs[i]["gender2"];
            var p_gender3 = docs[i]["gender3"];
            var p_seat1 = docs[i]["seat1"];
            var p_seat2 = docs[i]["seat2"];
            var p_seat3 = docs[i]["seat3"];
            var p_personality1 = docs[i]["personality1"];
            var p_personality2 = docs[i]["personality2"];
            var p_personality3 = docs[i]["personality3"];
            var p_food1 = docs[i]["food1"];
            var p_food2 = docs[i]["food2"];
            var p_food3 = docs[i]["food3"];

            var u_total = 0;
            var p_score = 0;
            u_total += parseInt(u_gender3) + parseInt(u_seat3) + parseInt(u_personality3) + parseInt(u_food3)

            if(u_gender2 == p_gender1){
              p_score += parseInt(u_gender3);
            }

            if(u_seat2 == p_seat1){
              p_score += parseInt(u_seat3);
            }

            if(u_personality2 == p_personality1){
              p_score += parseInt(u_personality3);
            }

            if(u_food2 == p_food1){
              p_score += parseInt(u_food3);
            }

            var p_final = p_score / u_total; 

            console.log("p_score: " + p_score);
            console.log("u_total: " + u_total);
            console.log("p_final: " + p_final);


            var p_total = 0;
            var u_score = 0;
            p_total += parseInt(p_gender3) + parseInt(p_seat3) + parseInt(p_personality3) + parseInt(p_food3)

            if(p_gender2 == u_gender1){
              u_score += parseInt(p_gender3);
            }

            if(p_seat2 == u_seat1){
              u_score += parseInt(p_seat3);
            }

            if(p_personality2 == u_personality1){
              u_score += parseInt(p_personality3);
            }

            if(p_food2 == u_food1){
              u_score += parseInt(p_food3);
            }

            var u_final = u_score / p_total; 

            console.log("u_score: " + u_score);
            console.log("p_total: " + p_total);
            console.log("u_final: " + u_final);

            var compatibility = Math.sqrt(p_final * u_final);

            console.log("compatibility: " + compatibility);

            all_scores[p_username] = Math.ceil(compatibility * 100);

          }

        }

        console.log(all_scores);
        res.end(JSON.stringify(all_scores));

      });
  });

}

doSearch3 = function(req, res){
  users.findByUsername(decodeURI(req.params.username), function(err, result){
      console.log("got user data");
      console.log(result);
      var u_gender1 = result["gender1"];
      var u_gender2 = result["gender2"];
      var u_gender3 = result["gender3"];
      var u_seat1 = result["seat1"];
      var u_seat2 = result["seat2"];
      var u_seat3 = result["seat3"];
      var u_personality1 = result["personality1"];
      var u_personality2 = result["personality2"];
      var u_personality3 = result["personality3"];
      var u_food1 = result["food1"];
      var u_food2 = result["food2"];
      var u_food3 = result["food3"];
      var u_pass = result["password"];

      var all_scores = {};
      var result = [];
      var result2 = []
      users.getAll(function(docs){
        for(var i=0; i<docs.length; i++){
          if(decodeURI(req.params.username) != docs[i]["username"]){
            var p_username = docs[i]["username"];
            var p_gender1 = docs[i]["gender1"];
            var p_gender2 = docs[i]["gender2"];
            var p_gender3 = docs[i]["gender3"];
            var p_seat1 = docs[i]["seat1"];
            var p_seat2 = docs[i]["seat2"];
            var p_seat3 = docs[i]["seat3"];
            var p_personality1 = docs[i]["personality1"];
            var p_personality2 = docs[i]["personality2"];
            var p_personality3 = docs[i]["personality3"];
            var p_food1 = docs[i]["food1"];
            var p_food2 = docs[i]["food2"];
            var p_food3 = docs[i]["food3"];

            var u_total = 0;
            var p_score = 0;
            u_total += parseInt(u_gender3) + parseInt(u_seat3) + parseInt(u_personality3) + parseInt(u_food3)

            if(u_gender2 == p_gender1){
              p_score += parseInt(u_gender3);
            }

            if(u_seat2 == p_seat1){
              p_score += parseInt(u_seat3);
            }

            if(u_personality2 == p_personality1){
              p_score += parseInt(u_personality3);
            }

            if(u_food2 == p_food1){
              p_score += parseInt(u_food3);
            }

            var p_final = p_score / u_total; 

            console.log("p_score: " + p_score);
            console.log("u_total: " + u_total);
            console.log("p_final: " + p_final);


            var p_total = 0;
            var u_score = 0;
            p_total += parseInt(p_gender3) + parseInt(p_seat3) + parseInt(p_personality3) + parseInt(p_food3)

            if(p_gender2 == u_gender1){
              u_score += parseInt(p_gender3);
            }

            if(p_seat2 == u_seat1){
              u_score += parseInt(p_seat3);
            }

            if(p_personality2 == u_personality1){
              u_score += parseInt(p_personality3);
            }

            if(p_food2 == u_food1){
              u_score += parseInt(p_food3);
            }

            var u_final = u_score / p_total; 

            console.log("u_score: " + u_score);
            console.log("p_total: " + p_total);
            console.log("u_final: " + u_final);

            var compatibility = Math.sqrt(p_final * u_final);

            console.log("compatibility: " + compatibility);

            all_scores[p_username] = [Math.ceil(compatibility * 100), docs[i]["booking"]];

            //docs[i]["score"] = 
            result.push([p_username, Math.ceil(compatibility * 100), docs[i]["booking"], p_gender1, p_personality1, p_food1]);


            

          }

        }

        var max=-1;
        var max_index=-1;
        for(var i=0; i<result.length;i++){
          if(result[i][1] > max){
            max = result[i][1];
            max_index = i;
          }
        }

        var max2=-1;
        var max_index2=-1;
        for(var i=0; i<result.length;i++){
          if(result[i][1] > max2 && i!=max_index){
            max2 = result[i][1];
            max_index2 = i;
          }
        }

        if(max_index >= 0){
          result2.push(result[max_index]);
        }
        if(max_index >= 0){
          result2.push(result[max_index2]);
        }

        console.log(all_scores);
        console.log(result2);
        //res.end(JSON.stringify(all_scores));

        res.render('seat', {result: result2});

      });
  });

}

doBooking = function(req, res){
  users.book(req.params.username, req.params.booking, function(result){
    res.end("Successful");
  });

}

