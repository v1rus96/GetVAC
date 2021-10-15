var express = require("express");
var mongoose = require("mongoose");
const port = 80;
const app = express();

mongoose.connect("mongodb+srv://admin:admin@ktrialinfo.kbp1y.mongodb.net/getvac?retryWrites=true&w=majority", {
useNewUrlParser: true,
useUnifiedTopology: true,
});
var db = mongoose.connection;

app.use(express.json());

// For serving static HTML files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
res.set({
	"Allow-access-Allow-Origin": "*",
});
	
// res.send("Hello World");
return res.redirect("index.html");
});

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

db.collection("users").insertOne(
data, (err, collection) => {
	if (err) {
	throw err;
	}
	console.log("Data inserted successfully!");
});

return res.redirect("formSubmitted.html");
});

app.get('/name', (req, res) => {
    db.collection('users').find().toArray()
    .then(results => {
      console.log(results)
    })
    .catch(error => console.error(error))
    return res.redirect("index.html");
});

app.listen(port, () => {
console.log(`The application started
successfully on port ${port}`);
});
