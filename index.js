const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  passport = require("passport"),
  bodyParser = require("body-parser"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose"),
  User = require("./models/user"),
  port = 80;

mongoose.connect(
  "mongodb+srv://admin:admin@ktrialinfo.kbp1y.mongodb.net/getvac?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.use(
  require("express-session")({
    secret: "Any normal Word", //decode or encode session
    resave: false,
    saveUninitialized: false,
  })
);

passport.serializeUser(User.serializeUser()); //session encoding
passport.deserializeUser(User.deserializeUser()); //session decoding
passport.use(new LocalStrategy(User.authenticate()));

var db = mongoose.connection;
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
//=======================
//      R O U T E S
//=======================
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/userprofile", isLoggedIn, (req, res) => {
  res.render("userprofile");
});
//Auth Routes
app.get("/login", (req, res) => {
  res.render("login");
});
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/userprofile",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);
app.get("/register-doctor", (req, res) => {
  res.render("register-doctor");
});
app.post("/register-doctor", (req, res) => {
  User.register(
    new User({
      username: req.body.username,
      fullName: req.body.fullName,
      email: req.body.email
    }),
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.render("register-doctor");
      }
      passport.authenticate("local")(req, res, function () {
        res.redirect("/login");
      });
    }
  );
});
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.post("/formFillUp", (req, res) => {
  var name = req.body.name;
  var reason = req.body.reason;
  var email = req.body.email;
  var phone = req.body.phone;
  var city = req.body.city;
  var state = req.body.state;
  var addressline = req.body.addressline;

  var data = {
    name: name,
    reason: reason,
    email: email,
    phone: phone,
    city: city,
    state: state,
    addressline: addressline,
  };

  db.collection("users").insertOne(data, (err, collection) => {
    if (err) {
      throw err;
    }
    console.log("Data inserted successfully!");
  });

  return res.redirect("formSubmitted.html");
});

app.get("/users", (req, res) => {
  db.collection("users")
    .find()
    .toArray()
    .then((results) => {
      res.render("formSubmitted.ejs", { users: results });
    })
    .catch((error) => console.error(error));
});

app.listen(port, () => {
  console.log(`The application started
successfully on port ${port}`);
});
