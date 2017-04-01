import pandas as pd
import datetime

DATA = pd.read_csv('data.csv')
INCEDENTS = DATA.iterrows()

def calc_delta_time(start, end, export_url):
    zip_codes = {}

    for incident in DATA.iterrows():
        zip_code = incident[1]['Incident ZIP Postal']
        first_time = datetime.datetime.strptime(incident[1][start], '%m/%d/%Y %I:%M:%S %p')
        second_time = datetime.datetime.strptime(incident[1][end], '%m/%d/%Y %I:%M:%S %p')
        delta_time = (second_time - first_time)
        if resonable(delta_time):
            if zip_code in zip_codes:
                zip_codes[zip_code]['total_time']+=delta_time
                zip_codes[zip_code]['num_incedents']+=1
            else:
                zip_codes[zip_code] = {'total_time': delta_time, 'num_incedents': 1}

    for z in zip_codes:
        zip_codes[z] = (zip_codes[z]['total_time'] / zip_codes[z]['num_incedents']).seconds

    dataframe = pd.DataFrame(zip_codes.items(), columns=['zip_code', 'value'])
    dataframe.to_csv(export_url, sep='\t', index_label=False, index=False)

def resonable(time):
    if time < datetime.timedelta(seconds=0):
        print(time)
        return False
    if time > datetime.timedelta(hours=10):
        print(time)
        return False
    return True

calc_delta_time("Time Call Was Received", "Time Arrived on Scene", "../response_time.tsv")
calc_delta_time("Time Call Was Received", "Time Vehicle was Dispatched", "../dispach_time.tsv")
