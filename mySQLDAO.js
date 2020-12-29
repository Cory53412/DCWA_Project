//importing prmoise-mySQL
var mysql = require('promise-mysql');
var pool

//creating mysql pool
mysql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'geography'
})
    .then((result) => {
        pool = result;
    })
    .catch((err) => {
        console.log(err);
    })

//functions
//get cities function returns all cities in DB
var getCities = function () {
    //returning a new promise
    return new Promise((resolve, reject) => {
        pool.query('select * from city')
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            })
    })
}

//get city function returns a city if it matches cty_code
var getCity = function (cty_code) {
    return new Promise((resolve, reject) => {
        //query which is passed then to the promise
        var myQuery = {
            sql: 'select * from city where cty_code = ? ',
            values: [cty_code]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

//get Countries function which returns all countries in the DB
var getCountries = function (co_code) {
    return new Promise((resolve, reject) => {
        myQuery = (co_code == undefined ? "select * from country" : "select * from country where co_code = ?;");
        var queryObj = {
            sql: myQuery,
            values: [co_code]
        }
        pool.query(queryObj)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//add country function which allows user to add a country to the db
var addCountry = function (co_code, co_name, co_details) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'INSERT INTO country VALUES (?,?,?)',
            values: [co_code, co_name, co_details]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//delete country function which removes a document from the db
var deleteCountry = function (co_code) {
    return new Promise((resolve, reject) => {
        var newQuery = {
            sql: 'delete from country where co_code = ?',
            values: [co_code]
        }
        pool.query(newQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

// not working-----> doesnt pass updated data into db
var updateCountry = function ( co_name,co_details, co_code) {
    //return a new promise
   return new Promise((resolve, reject) => {
     //query then sends a result
     var myQuery = {
         sql: 'update country set co_name =?, co_details=? where co_code =?',
         values: [co_name, co_details, co_code]
     }
     pool.query(myQuery)
           .then((result) => {
               resolve(result)
           })
           .catch((error) => {
               reject(error)
           })
   })
 }

 //functions exported so can be used throughout application
module.exports = { getCities, getCity, getCountries, deleteCountry, updateCountry, addCountry }

