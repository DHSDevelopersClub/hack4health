import pandas as pd
import datetime

DATA = pd.read_csv('data.csv')
INCEDENTS = DATA.iterrows()

zip_codes = {}

def resonable(time):
    if time < datetime.timedelta(seconds=0):
        print(time)
        return False
    if time > datetime.timedelta(hours=10):
        print(time)
        return False
    return True

for incident in DATA.iterrows():
    zip_code = incident[1]['Incident ZIP Postal']
    dispached = datetime.datetime.strptime(incident[1]["Time Vehicle was Dispatched"], '%m/%d/%Y %I:%M:%S %p')
    callReceived = datetime.datetime.strptime(incident[1]["Time Call Was Received"], '%m/%d/%Y %I:%M:%S %p')
    resp_time = (dispached - callReceived)
    if resonable(resp_time):
        if zip_code in zip_codes:
            zip_codes[zip_code]['total_time']+=resp_time
            zip_codes[zip_code]['num_incedents']+=1
        else:
            zip_codes[zip_code] = {'total_time': resp_time, 'num_incedents': 1}

for z in zip_codes:
    zip_codes[z] = (zip_codes[z]['total_time'] / zip_codes[z]['num_incedents']).seconds

dataframe = pd.DataFrame(zip_codes.items(), columns=['zip_code', 'value'])
dataframe.to_csv('../client/dispach_time.tsv', sep='\t', index_label=False, index=False)
