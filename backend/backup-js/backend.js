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
//var hash = cot.Util.Geohash.encode(31.123456,15.321654);
//var id1 = "lora.70B3D58FF0032D3A";
//var id2 = "lora.70B3D58FF0032D46";
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
var dataClient = client.withSources("lora.70B3D58FF0032D3A", "lora.70B3D58FF0032D46", "lora.70B3D58FF0032D4A", "lora.70B3D58FF0032D71", "lora.70B3D58FF0032D89", "lora.70B3D58FF0032E0B", "lora.70B3D58FF0032E24", "lora.70B3D58FF0032E3A", "lora.70B3D58FF0032E42", "lora.70B3D58FF0032E48", "lora.70B3D58FF0032E49",  "lora.70B3D58FF0032E4D", "lora.70B3D58FF0032E55", "lora.70B3D58FF0032E5D", "lora.70B3D58FF0032E62",  "lora.70B3D58FF0032E82", "lora.70B3D58FF0032E95", "lora.70B3D58FF0032EA2"   );
var layerClient = client.withCityId(cityId);
var response = dataClient.getData("airquality.no2");
//console.log(response);

var response_layer= layerClient.getLayer("airquality.no2");

MongoClient.connect(url, function(err, db) {
var dbo = db.db("mydb");
client.getSources().subscribe(
    function(nextData) { 
        // handle nextData as its coming in, this handler will be called on every update with new data
        console.log(nextData)

        //nextData.data.values[0];
    },
    function(error) {
        // do something when an error occurs
    },
    function() {
        // this handler will be called when the data streaming is complete and there is no more incoming data
    });


//console.log(Util.Time.timestamp(2018,4,13));
/*
layerClient.dataClient.getDay(Util.Time.timestamp(2018,4,4)).subscribe(
    function(nextData) { 
        // handle nextData as its coming in, this handler will be called on every update with new data
        console.log(nextData)
    },
    function(error) {
        // do something when an error occurs
    },
    function() {
        // this handler will be called when the data streaming is complete and there is no more incoming data
    });
  */ 
 //console.log(Util.Time.timestamp(2018,5,27,11));
 //Day is going to be incremented time at 22:00:00
 
 var dateObj = new Date();
 var month = dateObj.getUTCMonth() + 1; //months from 1-12
 var day = dateObj.getUTCDate();
 var year = dateObj.getUTCFullYear();
 var fromHour = 22;
 var toHour = 23;
 var javascriptObj = {}

 dataClient.getData("environment.temperature").range(Util.Time.timestamp(2018,month,day,20,0,0),Util.Time.timestamp(2018,month,day,21,0,0)).subscribe(
    function(nextData) { 
    	
		
        nextData.data.values.forEach((num, index) => {
				var javascriptObj = {"metric": "temperature" , "id": nextData.data.values[index][2] , "timestamp":  nextData.data.values[index][0] , "value": nextData.data.values[index][3]};		
				//console.log(nextData.data.values[index][2]);
				//arrayObj.push(javascriptObj);
				dbo.collection("metricstemp").insertOne(javascriptObj, function(err, res) {
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
				dbo.collection("metricstemp").insertOne(javascriptObj, function(err, res) {
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
        //fs.writeFile("dataTemp.json", JSON.stringify(arrayObj)); 
        db.close();
    }

    );	 
/*dataClient.getData("environment.temperature").latest().subscribe(
    function(nextData) { 
        //console.log(nextData);
        date_for_test = "152620"
        date_for_test2 = "152621"

		nextData.data.values.forEach((num, index) => {
			timestamp = nextData.data.values[index][0]
			if(parseInt(nextData.data.values[index][0])>=1526284856671 && parseInt(nextData.data.values[index][0])<=1526288456671){
				//the_seventh = nextData.data.values[index][0].toString().substring(6,7);
				//the_eighth = nextData.data.values[index][0].toString().substring(7,8);
				//the_seventh_eighth = the_seventh + the_eighth;
				//stamp_check_range = parseInt(the_seventh_eighth);
				//if(stamp_check_range >= 91 && stamp_check_range <= 99){
					//console.log(nextData.data.values[index][0]);
					var mobile = ["lora.70B3D58FF0032E5D", "lora.70B3D58FF0032E3A", "lora.70B3D58FF0032D4A", "lora.70B3D58FF0032D71", "lora.70B3D58FF0032E6C", "lora.70B3D58FF0032D3A", "lora.70B3D58FF0032E82", "lora.70B3D58FF0032E95", "lora.70B3D58FF0032E24", "lora.70B3D58FF0032E62", "lora.70B3D58FF0032E63", "lora.70B3D58FF0032E42", "lora.70B3D58FF0032D46", "lora.70B3D58FF0032E6E"];
					var fixed = ["lora.70B3D58FF0032ED2", "lora.70B3D58FF0032EA2", "lora.70B3D58FF0032E49", "lora.70B3D58FF0032E81", "lora.70B3D58FF0032E48"];
				if(mobile.includes(nextData.data.values[index][2]))
				{
					var mean = 0;
					var count = 0;
					var geohashes = [];
					geohashes.push(nextData.data.values[index][1]);
					geohash = nextData.data.values[index][1];
					var neighboursObj = Geohash.neighbours(geohash);
					var neighboursArr = Object.keys(neighboursObj).map(function(n) { return neighboursObj[n]; });
					var neighbors_value = [];
					mean  = nextData.data.values[index][3];
					neighbors_value.push(mean);
					//console.log(nextData.data.values[index][1]);
					//console.log(neighboursArr);
					//console.log(nextData.data.values[index][2]);
					//console.log(nextData.data.values[index][3]);
					nextData.data.values.forEach((num, index) => {

						if(geohash.substring(0,10) == (nextData.data.values[index][1]).substring(0,10) && nextData.data.values[index][1] != geohash ){
							count++
							mean+=nextData.data.values[index][3];
							neighbors_value.push(nextData.data.values[index][3]);
						}
					});
					//console.log("Mobile values");
					//console.log(neighbors_value);
	
				}

					if(fixed.includes(nextData.data.values[index][2]))
				{

					console.log(nextData.data.values[index][2]);
					/*
					var neighbors_fixed_value = [];
					neighbors_fixed_value.push(nextData.data.values[index][3]);
					nextData.data.values.forEach((num, index) => {

						if(geohash.substring(0,10) == (nextData.data.values[index][1]).substring(0,10) && nextData.data.values[index][1] != geohash ){
							neighbors_fixed_value.push(nextData.data.values[index][3]);
						}
					});*/

					//console.log("Fixed values");
					//console.log(neighbors_fixed_value);
	
				//}

			//}
			//}
		//});
   // },
    /*function(error) {
        // do something when an error occurs
    },
    function() {
        // this handler will be called when the data streaming is complete and there is no more incoming data
    }*/
//);

/*
dataClient.getData("environment.temperature").latest().subscribe(
    function(nextData) { 

		console.log(nextData);
	
    },
    function(error) {
        // do something when an error occurs
    },
    function() {
        // this handler will be called when the data streaming is complete and there is no more incoming data
    }
);
*/
/*client.getCityIds().subscribe(
    function(nextData) { 
        // handle nextData as its coming in, this handler will be called on every update with new data
        console.log(nextData)
    },
    function(error) {
        // do something when an error occurs
    },
    function() {
        // this handler will be called when the data streaming is complete and there is no more incoming data
    }
);*/
});
