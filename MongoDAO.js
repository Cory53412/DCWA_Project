//importing mongodb
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'headsOfStateDB';
const collName = 'headsOfState';

var headsOfStateDB;
var headsOfState;


//setting up mongo connection
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    //assigning variable headsOfstateDB to const variable dbName
    headsOfStateDB = client.db(dbName);
    //assigning variable headsOfstate to const variable collName
    headsOfState = headsOfStateDB.collection(collName);
  })
  .catch((err) => {
    console.log(err);
  })

  //returns documents from mongo db---> doesnt work in ejs format, but mongo is connected
var getheadsOfState = function(){
  return new Promise ((resolve , reject) =>{
    var cursor = headOfState.find();
    cursor.toArray()
    .then((documents)=>{
      resolve(documents);
    })
    .catch((err)=>{
      reject(err);
    })
  })
}
//add new head of state function
var addHeadOfState = function(_id, headOfState){
  return new Promise((resolve, reject)=>{
      headsOfState.insertOne({"_id":_id, "headOfState":headOfState})
      .then((result)=>{
          resolve(result)
      })
      .catch((error)=>{
          reject(error)
      })
  })
}

//exporting functions to be used throughout application
module.exports = {getheadsOfState, addHeadOfState};
