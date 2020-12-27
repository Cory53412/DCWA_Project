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

//creating a new promise
//if query is correct, then go into then , else catch
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

var getCity = function(cty_code){
    return new Promise((resolve , reject)=>{
        var myQuery = {
            sql:'select * from city where cty_code = ? ',
            values:[cty_code]
        }
        pool.query(myQuery)
        .then((result)=>{
            resolve(result)
        })
        .catch((err)=>{
           // console.log(err)
            reject(err)
        })
    })
}

module.exports = { getCities , getCity }

