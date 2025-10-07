# process_data.py
"""
Extracts migration inflow data to Australia from raw datasets and
saves a cleaned migration.csv file for visualization.
"""

import pandas as pd
import pycountry
from pathlib import Path

# --- FILE PATHS ---
DATA_DIR = Path("dataset")  # adjust if your files are stored elsewhere
UNDESA_FILE = DATA_DIR / "undesa_pd_2015_migration_flow_totals (1).csv"
INFLOW_FILE = DATA_DIR / "Inflows of foreign population.xlsx"
OUTPUT_FILE = DATA_DIR / "migration.csv"

# --- STEP 1: Load datasets ---
print("Loading datasets...")
try:
    undesa = pd.read_csv(UNDESA_FILE)
    inflow = pd.read_excel(INFLOW_FILE)
except Exception as e:
    print(f"Error loading files: {e}")
    exit()

# --- STEP 2: Standardize column names ---
undesa.columns = undesa.columns.str.strip().str.lower()
inflow.columns = inflow.columns.str.strip().str.lower()

# --- STEP 3: Filter to Australia as destination ---
australia_flows = pd.DataFrame()

# For UNDESA data
if "destination" in undesa.columns:
    aus_undesa = undesa[undesa["destination"].str.contains("australia", case=False, na=False)]
elif "to" in undesa.columns:
    aus_undesa = undesa[undesa["to"].str.contains("australia", case=False, na=False)]
else:
    aus_undesa = pd.DataFrame()

# For inflows data
if "country" in inflow.columns and "australia" in inflow["country"].str.lower().values:
    aus_inflow = inflow[inflow["country"].str.contains("australia", case=False, na=False)]
elif "destination" in inflow.columns:
    aus_inflow = inflow[inflow["destination"].str.contains("australia", case=False, na=False)]
else:
    aus_inflow = pd.DataFrame()

# Combine datasets
combined = pd.concat([aus_undesa, aus_inflow], ignore_index=True)

# --- STEP 4: Identify source/origin and migrant counts ---
possible_country_cols = ["origin", "from", "source", "country of origin"]
possible_migrant_cols = ["migrants", "value", "total", "flow", "number"]

def find_col(df, candidates):
    for c in candidates:
        matches = [col for col in df.columns if c in col]
        if matches:
            return matches[0]
    return None

country_col = find_col(combined, possible_country_cols)
migrant_col = find_col(combined, possible_migrant_cols)

if not country_col or not migrant_col:
    raise ValueError("Could not find suitable columns for country or migrant count.")

clean_df = combined[[country_col, migrant_col]].rename(columns={country_col: "country", migrant_col: "migrants"})

# --- STEP 5: Add latitude and longitude ---
def get_country_coords(country_name):
    """Return (lat, lon) tuple for a given country."""
    coords = {
        "Australia": (-25.2744, 133.7751),
    }
    try:
        import geopy.geocoders
        geolocator = geopy.geocoders.Nominatim(user_agent="geoapiExercises")
        loc = geolocator.geocode(country_name, timeout=10)
        if loc:
            return (loc.latitude, loc.longitude)
    except Exception:
        pass
    # fallback — return None
    return (None, None)

print("Adding coordinates (this may take a few seconds)...")
unique_countries = clean_df["country"].dropna().unique()
coord_map = {}

for c in unique_countries:
    lat, lon = get_country_coords(c)
    coord_map[c] = (lat, lon)

coord_df = pd.DataFrame.from_dict(coord_map, orient="index", columns=["lat", "lon"]).reset_index().rename(columns={"index": "country"})
final_df = pd.merge(clean_df, coord_df, on="country", how="left")

# --- STEP 6: Clean and export ---
final_df = final_df.dropna(subset=["lat", "lon"])
final_df["migrants"] = pd.to_numeric(final_df["migrants"], errors="coerce")
final_df = final_df.dropna(subset=["migrants"])
final_df["migrants"] = final_df["migrants"].astype(int)

final_df = final_df[["country", "lat", "lon", "migrants"]].sort_values("migrants", ascending=False)

OUTPUT_FILE.parent.mkdir(exist_ok=True)
final_df.to_csv(OUTPUT_FILE, index=False)

print(f"✅ migration.csv created successfully at: {OUTPUT_FILE}")
print(final_df.head())
