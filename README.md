# outliers_detection_clustering_ldof

Project description

This project collects data from the city of things testbed and process it in order to single out outliers values.

Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

Prerequisites

Node js
Python 2.7

Installing

Running the backend.js file for data collection:

In the command line run: node backend.js month day

Where month and day represent the month and the day in which you need to collect data from. For testing purposes use month 07 and day 24

Running the hdbscan_2_dimensions.py file for Pms data analysis:

In the command line run: python hdbscan_2_dimensions.py date where date is the data you entered in the node js command line for testing purposes use "24.07.2018"

Running the ldof_temperature_no2.py file for Pms data analysis:

In the command line run: python ldof_temperature_no2.py date where date is the data you entered in the node js command line for testing purposes use "24.07.2018"

Built With

Node js - For data collection from the back end
Python - For data analysis

Authors

Mizero Angela
