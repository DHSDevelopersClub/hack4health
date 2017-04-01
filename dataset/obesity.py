import pandas as pd

DATA = pd.read_csv('obesity.csv')

new_data = DATA.iterrows()

for row in new_data:
    print(row[0])
