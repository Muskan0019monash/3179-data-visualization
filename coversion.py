import pandas as pd

# Load your Excel files
un_df = pd.read_excel("undesa_pd_2015_migration_flow_totals.xlsx")
print("Columns:", un_df.columns.tolist())
print(un_df.head())