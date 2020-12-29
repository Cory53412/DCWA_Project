//required imports 
var express = require('express');
var ejs = require('ejs');
var app = express();
const port = 3000;
var bodyParser = require('body-parser')
var mongoDAO = require('./mongoDAO');
var mySQLDAO = require('./mySQLDAO');

// body-parser responsible for parsing the incoming request bodies in a middleware before you handle it.
app.use(bodyParser.urlencoded({ extended: false }))

//view engie of our express application
app.set('view engine', 'ejs');

//renders home page of application
app.get('/', (req, res) => {
    res.render("home")
})

//brings user to listCities page where showcities.ejs is rendered 
app.get('/listCities', (req, res) => {
    mySQLDAO.getCities()
        .then((result) => {
            console.log(result);//printing result to console
            res.render('showCities', { cities: result });
        })
        .catch((err) => {
            res.send(err);//sending any error to console
        })
})

//get method to search for particular city in DB
app.get('/listCities/:city', (req, res) => {
    mySQLDAO.getCity(req.params.city)
        .then((result) => {
            //if the result is > than 0 render cityDetails page
            if (result.length > 0) {
                res.render('cityDetails', { cities: result })
            }
            else {
                res.send("<h3> no such city with id: " + req.params.city)
            }
        })
        .catch((err) => {
            console.log(err);
        })
})

//get countries method renders showCountries ejs to display all countries in DB
app.get('/listCountries', (req, res) => {
    mySQLDAO.getCountries()
        .then((result) => {
            console.log(result);
            res.render('showCountries', { country: result });
        })
        .catch((err) => {
            res.send(err);
        })
})

//get method to find single country and delete it if it is not a fk in city table
//else error displayed telling user it cannot be deleted
app.get('/listCountries/:country', (req, res) => {
    mySQLDAO.deleteCountry(req.params.country)
        .then((result) => {
            //if no rows were affected send this message
            if (result.affectedRows == 0) {
                res.send("<h3>Country: " + req.params.country + " doesnt exist")
            }
            //else delete document
            else {
                res.send("<h3> Country: " + req.params.country + " deleted")
            }
            res.send(result);
        })
//if cannot be deleted due to err, display error
        .catch((err) => {
            if (err.code == "ER_ROW_IS_REFERENCED_2") {
                res.send("<h3> ERROR: " + err.errno + " cannot delete college with ID:" + req.params.college + " as it has assossiated courses");
            }
            else {
                res.send("<h3> ERROR: " + err.errno + " " + error.sqlMessage)
            }

        })
})


//post method to post the query result to the server
app.post("/updateCountry", (req, res) => {
    //update the country with new params
    mySQLDAO.updateCountry(req.body.co_name, req.body.co_details, req.body.co_code)
        .then((data) => {
            //redirect user back listCountries page
            console.log(data);
            res.redirect('/listCountries')
        })
        .catch((error) => {
            console.log(error)
        })
})

//get method to render updatecountry.ejs and display the co_code in rendered page
app.get('/updateCountry/:country', (req, res) => {
    mySQLDAO.getCountries(req.params.country)
        .then((result) => {
            console.log(result)
            res.render("updateCountry", { country: result[0] })
        })
        .catch((error) => {
            res.send(error)
        })
})

//render add country page
app.get('/addCountry', (req, res) => {
    res.render("addCountry");
})

app.post("/addCountry", (req, res) => {
    mySQLDAO.addCountry(req.body.co_code, req.body.co_name, req.body.co_details)
        .then((result) => {
            console.log(result)
            res.redirect('/listCountries')
        })
        .catch(() => {
            res.send("Country already exists");
        })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


// not working --------------------------------------------------------------------------------------------------------------------------------------

//rendering the head of state page
app.get('/addheadOfState', (req, res) => {
    res.render("addheadOfState")
})

//get method which renders headofstate
app.get('/headofstate', (req, res) => {
    mongoDAO.getheadsOfState()
        .then((result) => {
            //rendering the head of state page
            res.render('headofstate', { headofstate: result })
        })
        .catch((error) => {
            res.send(error)
        })
})

//post method to return result and redirect user to headofstate.ejs
app.post('/addheadOfState', (req, res) => {
    mongoDAO.addHeadOfState(req.body._id, req.body.headOfState)
        .then((result) => {
            res.redirect('/headofstate')
        }).catch((error) => {
            res.send('<h3>Error Cannot Connect to database! </h3')
        })
})




