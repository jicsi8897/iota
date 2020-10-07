'use strict'
const express = require('express');
var cors = require('cors');
const app = express();
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
//const web3= require('web3');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.options('*',cors());
app.use(cors());
const port = 5000;
var mongoUtil = require( './mongoUtil' );

mongoUtil.connectToServer( function( err, client ) {
  if (err) console.log(err);
  // start the rest of your app here
} );

app.get('/receive_data',(req,res)=>{
     var dbo = mongoUtil.getDb();
    dbo.createCollection("vendors", function(err, res) {
   
  });
   dbo.createCollection("vendors_weight", function(err, res) {
   
  });
    var data= req.body;
   

     var query={ imei: data.imei };//"SELECT * FROM vendors WHERE imei = '"+data.imei+"'";
   dbo.collection("vendors").find(query).toArray(function(err, result) {
    if (err) throw err;
   if(result.length>0)
   {
   
    console.log(result);
  //  console.log(data.imei);
   } 
   else
   {
    let vals= data.values;
/* dbo.collection("customers").updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
    db.close();
  });*/
    vals.systolic= Math.round((vals.systolic/133.322));
    vals.diastolic= Math.round((vals.diastolic/133.322));
    
    dbo.collection("vendors").insertOne(data, function(err, res) {
    if (err) throw err;
   
   
  });
   }
   
  });
  return false;
  
});
  
 
/*app.post('/sendEmail',(req,res)=>{
    var email = req.body.email;
   var first_name= req.body.first_name;
  var last_name= req.body.last_name;
  var msg= req.body.msg;
  console.log(email);
     var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'email here',
    pass: 'email password'
  }
});
    var mailOptions = {
  from: 'email here',
  to: email,
  subject: first_name,
  html: msg
};
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
   res.json({'error':error});
  } else {
   res.json({'error':'0'});
  }
});
    
});
*/
app.listen(port, () => 'server running on port '+port);