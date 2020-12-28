var mysql = require('promise-mysql');
var pool

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

var getCities = function () {
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

var getCity = function (cty_code) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'select * from city where cty_code = ? ',
            values: [cty_code]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((err) => {
                // console.log(err)
                reject(err)
            })
    })
}

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

// not working ------------------------------------------------------------------------------------------------------------------------------------
var updateCountry = function (co_code, co_name, co_details) {
    //return a new promise
    return new Promise((resolve, reject) => {
        //query then sends a result
        myQuery = (co_code == undefined ? "select * from country where co_code=?" : "update country set co_name =?, co_details=? where co_code =?;");
        var queryObj = {
            sql: myQuery,
            values: [co_code, co_name, co_details]
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

var addCountry = function (co_code, co_name, co_details) {
    //return a new promise
    return new Promise((resolve, reject) => {
        //query then sends a result
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


module.exports = { getCities, getCity, getCountries, deleteCountry, updateCountry, addCountry }

