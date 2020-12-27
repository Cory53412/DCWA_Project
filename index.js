var express = require('express');
var app = express();
const port = 3000;
var MongoDAO = require('./MongoDAO');
var mySQLDAO = require('./mySQLDAO');
var countries = require ('./countries');


app.set('view engine' , 'ejs');

app.get('/', (req, res) => {
    res.render("home")
})

//all city functions
app.get('/cityDetails', (req, res) => {
    res.render("cityDetails")
})

app.get('/listCities', (req, res) => {
    mySQLDAO.getCities()
        .then((result) => {
            console.log(result)
            res.render('showCities',{cities:result});
        })
        .catch((err)=>{
            res.send(err);
        })
})

app.get('/listCities/:city', (req,res)=>{
    mySQLDAO.getCity(req.params.city )
    .then((result)=>{
        if(result.length > 0){
            res.send(result);
        }
        else{
            res.send("<h3> no such city with id: " + req.params.city)      
      }
    })
    .catch((err)=>{
        console.log("NOK");
        console.log(err);
        res.send(err);
    })
})



//all country functions
app.get('/listCountries', (req, res) => {
    countries.getCountries()
        .then((result) => {
            console.log(result);
            res.render('showCountries',{country:result});
        })
        .catch((err)=>{
            res.send(err);
        })
})

app.get('/listCountries/:country' , (req,res)=>{
    countries.deleteCountry(req.params.country)
    .then((result)=>{
        if(result.affectedRows == 0){
            res.send("<h3>Country: " + req.params.country + " doesnt exist")
        }
        else{
            res.send("<h3> Country: " + req.params.country + " deleted" )
        }
        res.send(result);
    })
    .catch((err)=>{
        if(err.code == "ER_ROW_IS_REFERENCED_2"){
            res.send("<h3> ERROR: " + err.errno + " cannot delete college with ID:" + req.params.college + " as it has assossiated courses");
        }
        else{
            res.send("<h3> ERROR: " + err.errno + " " + error.sqlMessage)
        }
             
    })
})

//rendering the add country page
app.get('/addCountry', (req, res) => {
    res.render("addCountry")
})

app.post("/addCountry", (req, res) => {
    var myQuery = {
        sql: 'INSERT INTO country VALUES (?, ?, ?)',
        values: [req.body.co_code, req.body.co_name, req.body.co_details]
    }
    pool.query(myQuery)
        .then((data) => {
            res.redirect('/countries')
            console.log(data)
        })
        .catch((error) => {
           res.send('<h3>Country already exists </h3')
        })
})

app.get('/updateCountry', (req, res) => {
    res.render("updateCountry")
})


//all headOfStare functions
app.get('/listHeadsOfState', (req, res) => {
    MongoDAO.getheadsOfState()
    .then((documents)=>{
        res.send(documents)
    })
    .catch((err)=>{
        res.send(err)
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})