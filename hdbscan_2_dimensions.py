import numpy as np
import sys
from comparefiles import *
import time
from datetime import datetime
from sklearn.cluster import DBSCAN
import pylab as pl
from itertools import cycle
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.cluster import KMeans
from pymongo import MongoClient
import matplotlib.pyplot as plt
import hdbscan
import seaborn as sns
import time
from datetime import datetime
from sklearn.neighbors import LocalOutlierFactor
dataIdTemp = []
timestampTwenty = []
client = MongoClient()
db = client.mydb3
collection = db.current
cursor = collection.find()


def insertDatabase(index_lof,c,sensorIdTemp,sensorTemp):
    
    collection = db.outliers
    for i in index_lof:
            sensorId = sensorIdTemp[i]
            sensorPm10 = c[i][0]
            sensorPm1 = c[i][1]

            result ={
                "sensorId":sensorId,
                "timestamp":sensorTemp[i],
                "pm10":sensorPm10,
                "pm1":sensorPm1
                    }
            collection.insert_one(result)

            
def clustering(data,sensorIdTemp,sensorTemp):
    c = np.array(data)
    normal = []
    abnormal = []
    index_lof = []
    cluster_size = (len(data)//2)+1
    clusterer = hdbscan.HDBSCAN(allow_single_cluster=True,min_cluster_size=15 ,metric='manhattan').fit(c)
    clf = LocalOutlierFactor(n_neighbors=cluster_size)
    y_pred = clf.fit_predict(c)
    for index in range(len(c)):
        if y_pred[index] == -1:
            index_lof.append(index)
            #print (sensorIdTemp[index], sensorTemp[index])
    
    for i in range(0,len(c)):
        if clusterer.labels_[i]>=0:
            #ax.scatter(c[i][0],c[i][1],c[i][2], c='b', marker='o')
            plt.scatter(c[i][0],c[i][1], s=5, marker = "x", color="blue")
        else:
            if i not in index_lof:
                plt.scatter(c[i][0],c[i][1], s=5, marker = "x", color="red")
            else:
                plt.scatter(c[i][0],c[i][1], s=5, marker = "x", color="black")

    plt.xlabel('pm10')
    plt.ylabel('pm1')
    #plt.show()
    insertDatabase(index_lof,c,sensorIdTemp,sensorTemp)
    
def collect(a,m):
    sensorIdTemp=[]
    sensorTemp=[]
    data = []
    for document in collection.find():
        if a < document['timestamp'] and document['timestamp']<m:
            if document['metric']== "pm10":
                sensor = []
                sensor.append(document['value'])
                cursor1 = collection.find()
                for documents in collection.find():
                    if document['timestamp']== documents['timestamp'] and document['metric']== "pm10" and documents['metric']== "pm1" and document['id']== documents['id']:
                            if documents['value'] not in sensor:
                                sensor.append(documents['value'])
                                sensorIdTemp.append(document['id'])
                                sensorTemp.append(document['timestamp'])
                                data.append(sensor)
                            

    clustering(data,sensorIdTemp,sensorTemp)


currentDay = datetime.now().day
currentMonth = datetime.now().month
currentYear = datetime.now().year
strin = str(sys.argv[1])
#strin = '24.07.2018'
#strin = str(currentDay)+'.'+str(currentMonth)+'.'+str(currentYear)
ts= strin+' '+'22:00'
dt = datetime.strptime(ts, '%d.%m.%Y %H:%M')
a = time.mktime(dt.timetuple())*1000
m = a + (20*60*1000)
n = m + (20*60*1000)
o = n + (20*60*1000)
collect(a,m)
collect(m,n)
collect(n,o)
