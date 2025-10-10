# process_data.py
"""
Extracts migration inflow data to Australia from raw datasets and
saves a cleaned migration.csv file for visualization.
"""

import pandas as pd
from pathlib import Path

# --- FILE PATHS ---
DATA_DIR = Path("dataset")
UNDESA_FILE = DATA_DIR / "undesa_pd_2015_migration_flow_totals (1).csv"
INFLOW_FILE = DATA_DIR / "Inflows of foreign population.xlsx"
OUTPUT_FILE = DATA_DIR / "migration.csv"

# --- STEP 1: Load datasets ---
print("Loading datasets...")

# Robust CSV reader (auto-encoding and delimiter handling)
def safe_read_csv(file_path):
    try:
        # Try default first
        return pd.read_csv(file_path)
    except pd.errors.ParserError:
        print(f"⚠️ Parsing issue with {file_path.name}, retrying with ';' as delimiter...")
        return pd.read_csv(file_path, sep=';', engine='python')
    except UnicodeDecodeError:
        print(f"⚠️ Encoding issue with {file_path.name}, retrying with ISO-8859-1...")
        return pd.read_csv(file_path, encoding='ISO-8859-1')
    except Exception as e:
        raise RuntimeError(f"❌ Failed to load {file_path.name}: {e}")

undesa = safe_read_csv(UNDESA_FILE)
inflow = pd.read_excel(INFLOW_FILE)

print(f"✅ Loaded UNDESA dataset: {undesa.shape} rows, {undesa.columns.tolist()}")
print(f"✅ Loaded Inflow dataset: {inflow.shape} rows, {inflow.columns.tolist()}")

# --- STEP 2: Standardize column names ---
undesa.columns = undesa.columns.str.strip().str.lower()
inflow.columns = inflow.columns.str.strip().str.lower()

# --- STEP 3: Filter to Australia as destination ---
def filter_to_australia(df):
    for col in ["destination", "to", "country", "location"]:
        if col in df.columns:
            return df[df[col].astype(str).str.contains("australia", case=False, na=False)]
    return pd.DataFrame()

aus_undesa = filter_to_australia(undesa)
aus_inflow = filter_to_australia(inflow)
combined = pd.concat([aus_undesa, aus_inflow], ignore_index=True)

if combined.empty:
    raise ValueError("❌ No rows found for destination = Australia. Check your dataset column names.")

# --- STEP 4: Identify source/origin and migrant count columns ---
def find_col(df, keywords):
    for key in keywords:
        for col in df.columns:
            if key in col:
                return col
    return None

country_col = find_col(combined, ["origin", "from", "source", "country of origin", "country"])
migrant_col = find_col(combined, ["migrants", "value", "total", "flow", "number", "count"])

if not country_col or not migrant_col:
    raise ValueError(f"❌ Could not find suitable columns.\nAvailable columns: {combined.columns.tolist()}")

clean_df = combined[[country_col, migrant_col]].rename(columns={
    country_col: "country",
    migrant_col: "migrants"
})

# --- STEP 5: Add static coordinates (offline + instant) ---
coords_data = {
    "India": (20.5937, 78.9629),
    "China": (35.8617, 104.1954),
    "United Kingdom": (55.3781, -3.4360),
    "New Zealand": (-40.9006, 174.8860),
    "Philippines": (12.8797, 121.7740),
    "United States": (37.0902, -95.7129),
    "Vietnam": (14.0583, 108.2772),
    "Italy": (41.8719, 12.5674),
    "Greece": (39.0742, 21.8243),
    "Malaysia": (4.2105, 101.9758),
    "Sri Lanka": (7.8731, 80.7718),
    "South Africa": (-30.5595, 22.9375),
    "Pakistan": (30.3753, 69.3451),
    "Bangladesh": (23.685, 90.3563),
    "Ireland": (53.4129, -8.2439),
    "Singapore": (1.3521, 103.8198),
    "Fiji": (-17.7134, 178.065),
    "Hong Kong": (22.3193, 114.1694),
    "Canada": (56.1304, -106.3468),
    "France": (46.6034, 1.8883),
    "Germany": (51.1657, 10.4515)
}

coord_df = pd.DataFrame([
    {"country": k, "lat": v[0], "lon": v[1]} for k, v in coords_data.items()
])

final_df = pd.merge(clean_df, coord_df, on="country", how="left")

# --- STEP 6: Clean up and export ---
final_df["migrants"] = pd.to_numeric(final_df["migrants"], errors="coerce")
final_df = final_df.dropna(subset=["lat", "lon", "migrants"])
final_df["migrants"] = final_df["migrants"].astype(int)
final_df = final_df[["country", "lat", "lon", "migrants"]].sort_values("migrants", ascending=False)

OUTPUT_FILE.parent.mkdir(exist_ok=True)
final_df.to_csv(OUTPUT_FILE, index=False)

print(f"✅ migration.csv created successfully at: {OUTPUT_FILE}")
print(final_df.head())
