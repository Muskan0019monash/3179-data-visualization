import pandas as pd

# Load your Excel files
un_df = pd.read_excel("undesa_pd_2015_migration_flow_totals.xlsx")
abs_df = pd.read_excel("Graph 1.3 Overseas migrant departures - visa and citizenship groups(a).xlsx")

# --- Clean UN data (world migration to Australia) ---
# Example: filter only rows where Destination is "Australia"
world_df = un_df[un_df['Destination'] == 'Australia'][['Origin', 'Migrants']]

# Add lat/lon by merging with a country-latlon lookup
latlon = pd.read_csv("country_latlon.csv")
world_df = world_df.merge(latlon, left_on="Origin", right_on="country", how="left")

# Save for Vega-Lite
world_df.to_csv("data/world_migration.csv", index=False)

# --- Clean ABS data (top source countries for Australia) ---
aus_df = abs_df[['Country of birth', 'Population']]
aus_df = aus_df.rename(columns={'Country of birth': 'origin_country', 'Population': 'migrants'})
aus_df.to_csv("data/aus_migration.csv", index=False)
