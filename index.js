'user strict'
const express = require('express');
var cors= require('cors');
const app= express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.options('*',cors());
app.use(cors());
const port=3000;

var mongoUtil = require( './mongoUtil');
mongoUtil.connectToServer(function(err,client){
    if(err) console.log(err);
    console.log('running mongo db');
});
app.get('/',(req,res)=>{
    res.json({'msg':'running home'});
});
app.post('/get_data',(req,res)=>{
    var dbo = mongoUtil.getDb();
    var data= req.body;
    
    var query = {imei:data.imei};
    dbo.collection("vendors_data").find(query).toArray(function(err,result){
        if(err){res.json({'error':'1','message':err})}
        if(result.length>0)
        {
            res.json({'error':'0','message':'successfull','data':result});
        }
        else
        {
            res.json({'error':'1','message':'no data found'});
        }
    });
});
app.post('/receive_vendor',(req,res)=>{
  
    var dbo = mongoUtil.getDb();
   /* dbo.createCollection('vendors_data', function(err,res){
        if(err) console.log(err);
        console.log('vendors_data collection created');
    } );*/
    var data = req.body;
   
   var query= { imei: data.imei};
   dbo.collection("vendors_data").find(query).toArray(function(err,result){
    if(err) {res.json({'error':'1','message':err});}
    if(result.length>0)
    {
        res.json({'error':'1','message':'imei already exist'});
    }
    else
    {
        let vals= data.values;
        if(typeof vals.systolic==='object' && vals.systolic!==null)
        {
               vals.systolic= Math.round((vals.systolic/133.322));
    
        }
        if(typeof vals.diastolic==='object' && vals.diastolic!==null)
        {
               vals.diastolic= Math.round((vals.diastolic/133.322));
    
        }
        
       dbo.collection('vendors_data').insertOne(data, function(err,res){
        if(err) {res.json({'error':'1','message':err});}
        else
        {
            res.json({'error':'0','message':'data inserted successfully'});
        }
        
       });
    }
   });
    
});


app.listen(port, () => 'server running on port '+ port );
