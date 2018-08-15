from pymongo import MongoClient
client = MongoClient()
db = client.mydb3
collection = db.current
collection2 = db.previous
cursor = collection.find()
cursor2 = collection2.find()

sensors_list = ["lora.70B3D58FF0032D3A", "lora.70B3D58FF0032D46", "lora.70B3D58FF0032D4A", "lora.70B3D58FF0032D71", "lora.70B3D58FF0032E24", "lora.70B3D58FF0032E42", "lora.70B3D58FF0032E48", "lora.70B3D58FF0032E95", "lora.70B3D58FF0032E5D", "lora.70B3D58FF0032E62",  "lora.70B3D58FF0032E82", "lora.70B3D58FF0032E95", "lora.70B3D58FF0032EA2", "lora.70B3D58FF0032ED2", "lora.70B3D58FF0032E49"]
sensors_send = []

def insertDuplicate(sensor,timestamp,value):
    
    collection = db.duplicates

    result ={
        "sensorId":sensor,
        "timestamp":timestamp,
        "duplicate":value
    }
    collection.insert_one(result)

            
def insertUnavailable(sensor):
    
    collection = db.unavailable
    result ={
        "sensorId":sensor
    }
    collection.insert_one(result)
    

for item in cursor:
    if item['id'] not in sensors_send:
        sensors_send.append(item['id'])
        

for sensor in sensors_list:
    if sensor not in sensors_send:
        insertUnavailable(sensor)

if "previous" in db.collection_names():
    for item in cursor:
        for item2 in cursor2:
            if ((item['id'] == item2['id']) and (item['value'] == item2['value'] and item['metric'] == "temperature" )) and ((item['id'] == item2['id']) and (item['value'] == item2['value'] and item['metric'] == "no2" )):
                insertDuplicate(item['id'],item['timestamp'],item['value'])
