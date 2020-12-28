var express = require('express');
var app = express();
const port = 3000;
var bodyParser = require('body-parser')
var MongoDAO = require('./MongoDAO');
var mySQLDAO = require('./mySQLDAO');

app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render("home")
})

app.get('/listCities', (req, res) => {
    mySQLDAO.getCities()
        .then((result) => {
            console.log(result)
            res.render('showCities', { cities: result });
        })
        .catch((err) => {
            res.send(err);
        })
})

app.get('/listCities/:city', (req, res) => {
    mySQLDAO.getCity(req.params.city)
        .then((result) => {
            if (result.length > 0) {
                res.render('cityDetails', { cities: result })
            }
            else {
                res.send("<h3> no such city with id: " + req.params.city)
            }
        })
        .catch((err) => {
            console.log("NOK");
            console.log(err);
            res.send(err);
        })
})

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

app.get('/listCountries/:country', (req, res) => {
    mySQLDAO.deleteCountry(req.params.country)
        .then((result) => {
            if (result.affectedRows == 0) {
                res.send("<h3>Country: " + req.params.country + " doesnt exist")
            }
            else {
                res.send("<h3> Country: " + req.params.country + " deleted")
            }
            res.send(result);
        })
        .catch((err) => {
            if (err.code == "ER_ROW_IS_REFERENCED_2") {
                res.send("<h3> ERROR: " + err.errno + " cannot delete college with ID:" + req.params.college + " as it has assossiated courses");
            }
            else {
                res.send("<h3> ERROR: " + err.errno + " " + error.sqlMessage)
            }

        })
})

app.get('/updateCountry', (req, res) => {
    res.render("updateCountry")
})

app.post("/updateCountry", (req, res) => {
    var myQuery = {
        sql: 'update country set co_name =?, co_details=? where co_code =?',
        values: [req.body.co_name, req.body.co_details, req.body.co_code]
    }
    pool.query(myQuery)
        .then((data) => {
            //res.send(data)
            res.redirect('/countries')
        })
        .catch((error) => {
            console.log(error)
        })
})

app.get('/addCountry', (req, res) => {
    res.render("addCountry");
})

app.get('/newHeadOfState', (req, res) => {
    res.render("newHeadOfState")
})
app.get('/addHeadOfState', (req, res) => {
    res.render("AddheadOfState")
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


// not working --------------------------------------------------------------------------------------------------------------------------------------

app.get('/updateCountry/:country', (req, res) => {
    home.getCountries(req.params.country)
        .then((result) => {
            console.log(result)
            res.render("update", { country: result[0] })
        })
        .catch((error) => {
            res.send(error)
        })
})

app.get('/newHeadOfState', (req, res) => {
    MongoDAO.getheadsOfState()
        .then((result) => {
            console.log(result);
            res.render('newHeadOfState', { headOfState: result })
        })
        .catch((err) => {
            res.send(err)
        })
})

app.post('/headsOfState', (req, res)=>{
    MongoDAO.getheadsOfState(req.body._id, req.body.headsOfState)
    .then((result)=>{
        res.redirect('/headsOfState')
    }).catch((error)=>{
        res.send('<h3>Error Cannot Connect to database! </h3')
    })
})

app.post("/addCountry", (req, res) => {
    mySQLDAO.addCountry(req.body.co_code, req.body.co_name, req.body.co_details)
        .then((result) => {
            console.log(result)
            res.redirect('/showCountries')
        })
        .catch(() => {
            res.send("Country already exists");
        })
})


