import pandas as pd

DATA = pd.read_csv('opioids.csv')

rows = DATA.iterrows()

def get_maximum_effected(data):
    maximum = 0
    for row in data:
        percent = row[1][5]
        num = float(percent[:-1])
        if (num > maximum):
            maximum = num
            agegroup_max = row[1][2]
            year = row[1][0]
    return maximum, agegroup_max, year

print(get_maximum_effected(rows))
