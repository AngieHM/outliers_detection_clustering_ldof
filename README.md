# outliers_detection_clustering_ldof

## Project description

This project collects data from the city of things testbed and analyze it for outliers detection using clustering and LDOF.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

## Prerequisites

Node js
Python 2.7

## Installing

### Running the backend.js file for data collection:

In the command line run: node backend.js month day

Where month and day represent the month and the day in which you need to collect data from. 
For testing purposes use month: 07 and day: 24

### Running the hdbscan_2_dimensions.py file for PM1 and PM10 data analysis:

In the command line run: python hdbscan_2_dimensions.py date 
where date is the data you entered in the node js command line for testing purposes use: "24.07.2018"

### Running the ldof_temperature_no2.py file for temperature and NO2 data analysis:

In the command line run: python ldof_temperature_no2.py date 
where date is the data you entered in the node js command line for testing purposes use: "24.07.2018"

## Built With

Node js - For data collection from the back end

Python - For data analysis

## Authors

Mizero Angela
