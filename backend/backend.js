var cot = require('cot-lib');
var Util = require('cot-lib').Util;
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var fs = require('fs');
var arrayObj = [];
//const neighboursOf = require('geohash-neighbours').neighboursOf;
var Geohash = require('latlon-geohash');
const Geo = require('geo-nearby');

var ZScore = require('z-score').default;
var zScore = new ZScore();
var credentials = {username: "idlab-a-student", password: "EythsQfk54nCaX6pnnd8H3zb"};
var client = new cot.CotClient('https://cot-api-dev.tengu.io/', credentials);

var ids =  ["lora.70B3D58FF0032D3A"
,"lora.70B3D58FF0032D46"
,"lora.70B3D58FF0032D4A"
,"lora.70B3D58FF0032D71"
,"lora.70B3D58FF0032D89"
,"lora.70B3D58FF0032E0B"
,"lora.70B3D58FF0032E24"
,"lora.70B3D58FF0032E3A"
,"lora.70B3D58FF0032E42"
,"lora.70B3D58FF0032E48"
,"lora.70B3D58FF0032E95"
,"lora.70B3D58FF0032E4D"
,"lora.70B3D58FF0032E55"
,"lora.70B3D58FF0032E5D"
,"lora.70B3D58FF0032E62"
,"lora.70B3D58FF0032E82"
,"lora.70B3D58FF0032E95"
,"lora.70B3D58FF0032EA2"];
var cityId = "antwerp_high_detail";
var dataClient = client.withSources("lora.70B3D58FF0032D3A", "lora.70B3D58FF0032D46", "lora.70B3D58FF0032D4A", "lora.70B3D58FF0032D71", "lora.70B3D58FF0032D89", "lora.70B3D58FF0032E0B", "lora.70B3D58FF0032E24", "lora.70B3D58FF0032E3A", "lora.70B3D58FF0032E42", "lora.70B3D58FF0032E48", "lora.70B3D58FF0032E95",  "lora.70B3D58FF0032E4D", "lora.70B3D58FF0032E55", "lora.70B3D58FF0032E5D", "lora.70B3D58FF0032E62",  "lora.70B3D58FF0032E82", "lora.70B3D58FF0032E95", "lora.70B3D58FF0032EA2", "lora.70B3D58FF0032ED2", "lora.70B3D58FF0032E49"  );
var layerClient = client.withCityId(cityId);
var response = dataClient.getData("airquality.no2");
//console.log(response);
 var dateObj = new Date();
var month = dateObj.getUTCMonth() + 1; //months from 1-12
var day = dateObj.getUTCDate();

var response_layer= layerClient.getLayer("airquality.no2");
const args = process.argv;
month = parseInt(args[2]);
day = parseInt(args[3]);

MongoClient.connect(url, function(err, db) {
 var dbo = db.db("mydb3");
 var year = dateObj.getUTCFullYear();
 var fromHour = 22;
 var toHour = 23;
 var javascriptObj = {}
 dbo.listCollections({name: "previous"})
    .next(function(err, collinfo) {
        if (collinfo) {
            dbo.collection("previous").rename("previous1", function(err, newColl) {});
        }
    });


dbo.listCollections({name: "current"})
    .next(function(err, collinfo) {
        if (collinfo) {
            dbo.collection("current").rename("previous", function(err, newColl) {
                console.log("renamed");
            });
        }
    });

 dataClient.getData("environment.temperature").range(Util.Time.timestamp(2018,month,day,20,0,0),Util.Time.timestamp(2018,month,day,21,0,0)).subscribe(
    function(nextData) { 

        nextData.data.values.forEach((num, index) => {
				var javascriptObj = {"metric": "temperature" , "id": nextData.data.values[index][2] , "timestamp":  nextData.data.values[index][0] , "value": nextData.data.values[index][3]};		
				//console.log(nextData.data.values[index][2]);
				//arrayObj.push(javascriptObj);
				dbo.collection("current").insertOne(javascriptObj, function(err, res) {
			    	if (err) throw err;
				    //console.log("1 document inserted");
			  });
		});  
    },

    function(error) {
        // do something when an error occurs
    },
    function() {
        //fs.writeFile("dataTemp.json", JSON.stringify(arrayObj)); 
       
    }

    );
 	dataClient.getData("airquality.no2").range(Util.Time.timestamp(2018,month,day,20,0,0),Util.Time.timestamp(2018,month,day,21,0,0)).subscribe(
    function(nextData) { 
    	
		
        nextData.data.values.forEach((num, index) => {
				var javascriptObj = {"metric": "no2" , "id": nextData.data.values[index][2] , "timestamp":  nextData.data.values[index][0] , "value": nextData.data.values[index][3]};		
				//console.log(nextData.data.values[index][2]);
				//arrayObj.push(javascriptObj);
				dbo.collection("current").insertOne(javascriptObj, function(err, res) {
				    if (err) throw err;
				    //console.log("1 document inserted");
				    //db.close();
			    
			  });
		});  
    },

    function(error) {
        // do something when an error occurs
    },
    function() {
 
    }

    );	 
    dataClient.getData("airquality.pm10").range(Util.Time.timestamp(2018,month,day,20,0,0),Util.Time.timestamp(2018,month,day,21,0,0)).subscribe(
    function(nextData) { 
    	
		
        nextData.data.values.forEach((num, index) => {
				var javascriptObj = {"metric": "pm10" , "id": nextData.data.values[index][2] , "timestamp":  nextData.data.values[index][0] , "value": nextData.data.values[index][3]};		
				//console.log(nextData.data.values[index][2]);
				//arrayObj.push(javascriptObj);
				dbo.collection("current").insertOne(javascriptObj, function(err, res) {
				    if (err) throw err;
				    //console.log("1 document inserted");
				    //db.close();
			    
			  });
		});  
    },

    function(error) {
        // do something when an error occurs
    },
    function() {

    }

    );	
    dataClient.getData("airquality.pm1").range(Util.Time.timestamp(2018,month,day,20,0,0),Util.Time.timestamp(2018,month,day,21,0,0)).subscribe(
    function(nextData) { 
    	
		
        nextData.data.values.forEach((num, index) => {
				var javascriptObj = {"metric": "pm1" , "id": nextData.data.values[index][2] , "timestamp":  nextData.data.values[index][0] , "value": nextData.data.values[index][3]};		
				//console.log(nextData.data.values[index][2]);
				//arrayObj.push(javascriptObj);
				dbo.collection("current").insertOne(javascriptObj, function(err, res) {
				    if (err) throw err;
				    //console.log("1 document inserted");
				    //db.close();
			    
			  });
		});  
    },

    function(error) {
        // do something when an error occurs
    },
    function() {
    dbo.listCollections({name: "previous1"})
    .next(function(err, collinfo) {
        if (collinfo) 
        {
            dbo.collection("previous1").drop(function(err, delOK) {
            if (err) throw err;
            if (delOK) console.log("Collection deleted");
            db.close();
          });
        }
    });
    db.close();
    }

    );	
   
});
