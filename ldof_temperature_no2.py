import numpy as np
from sklearn.cluster import DBSCAN
import pylab as pl
import sys
from itertools import cycle
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.cluster import KMeans
from pymongo import MongoClient
import hdbscan
import seaborn as sns
from scipy.spatial import distance
from sklearn.neighbors import LocalOutlierFactor
import itertools as tl
import time
from datetime import datetime
dataIdTemp = []
client = MongoClient()
db = client.mydb3
collection = db.current
cursor = collection.find()
timestampTwenty = []
def insertDatabase(index_lof,c,sensorIdTemp,sensorTemp,metric):
    
    collection = db.outliers
    for i in index_lof:
            sensorId = sensorIdTemp[i]
            value = c[i][0]

            result ={
                "sensorId":sensorId,
                "timestamp":sensorTemp[i],
                metric:value
                    }
            collection.insert_one(result)

def clustering(data,sensorIdTemp,sensorTemp,metric):
    c = np.array(data)
    cluster_size = (len(data)//2)+1
    index_lof = []
    clf = LocalOutlierFactor(n_neighbors=cluster_size)
    y_pred = clf.fit_predict(c)
    for index in range(len(c)):
        if y_pred[index] == -1:
            index_lof.append(index)
    val = 0. 
    for i in range(0,len(c)):
        if i in index_lof:
            #ax.scatter(c[i][0],c[i][1],c[i][2], c='b', marker='o')
            plt.scatter(c[i],1, s=5, marker = "x", color="black")
        else:
            plt.scatter(c[i],1, s=5, marker = "x", color="blue")
        val = val+1
    plt.xlabel('NO2')
    plt.ylabel('')
    plt.xticks(np.arange(min(c), max(c)+20, 20.0))
    #plt.show()
        
    insertDatabase(index_lof,c,sensorIdTemp,sensorTemp,metric)     
    
def groupValues(metric,a,m):
    data = []
    sensorIdTemp = []
    sensorTemp = []
    cursor2 = collection.find()
    for document in collection.find():
        if a < document['timestamp'] and document['timestamp']<m:
            if document['metric']== metric:
                sensor = []
                sensorIdTemp.append(document['id'])
                sensorTemp.append(document['timestamp'])
                sensor.append(document['value'])
                data.append(sensor,)

    """data.append([200])
    data.append([100])
    data.append([89])
    data.append([80])
    data.append([78])
    data.append([70])
    data.append([170])"""
   
    clustering(data,sensorIdTemp,sensorTemp,metric)

currentDay = datetime.now().day
currentMonth = datetime.now().month
currentYear = datetime.now().year
#strin = str(currentDay)+'.'+str(currentMonth)+'.'+str(currentYear)
strin = str(sys.argv[1])
ts= strin+' '+'22:00'
dt = datetime.strptime(ts, '%d.%m.%Y %H:%M')
a = time.mktime(dt.timetuple())*1000
m = a + (20*60*1000)
n = m + (20*60*1000)
o = n + (20*60*1000)

groupValues("no2",a,m)
groupValues("no2",m,n)
groupValues("no2",n,o)

groupValues("temperature",a,m)
groupValues("temperature",m,n)
groupValues("temperature",n,o)
