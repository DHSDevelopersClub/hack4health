import pandas as pd
import datetime

LENGTH = 47133

DATA = pd.read_csv('data.csv')
INCEDENTS = DATA.iterrows()

def calc_avg_resp_time(incidents):
    delta = 0
    for incedent in incidents:
        if (incedent[1][19] == 94960):
            arrived = datetime.datetime.strptime(incedent[1]["Time Vehicle was Dispatched"], '%m/%d/%Y %I:%M:%S %p')
            callRecieved = datetime.datetime.strptime(incedent[1][0], '%m/%d/%Y %I:%M:%S %p')
            diff = (arrived - callRecieved)
            coupleMinutes = datetime.timedelta(minutes=10)
            if diff > coupleMinutes:
                print(diff)

    return averageRespTime

def calc_avg_patient_age(incidents, zip):
    for incedent in incidents:
        if (incedent[1][19] == zip):
            if(incedent[1]['Patient Age']):
                age += int(incedent[1]['Patient Age'])

    return(age / LENGTH)

print(calc_avg_patient_age(INCEDENTS, 94960)
