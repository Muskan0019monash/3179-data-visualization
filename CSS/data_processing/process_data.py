import pandas as pd
import os

def process_migration_data():
    """
    Process raw Excel files into clean CSV for visualization
    Modify this based on your actual Excel file structure
    """
    try:
        # Read your Excel files - UPDATE THESE PATHS AND SHEET NAMES
        # Example structure - adapt to your actual files:
        
        # File 1: Migration numbers by country
        df_migration = pd.read_excel('raw_data/migration_raw.xlsx', sheet_name='Migration')
        
        # File 2: Country coordinates
        df_coords = pd.read_excel('raw_data/country_coordinates.xlsx', sheet_name='Coordinates')
        
        # File 3: Additional migration details (if available)
        # df_details = pd.read_excel('raw_data/migration_details.xlsx', sheet_name='Details')
        
        # Merge and clean data
        df_clean = pd.merge(df_migration, df_coords, on='country', how='inner')
        
        # Data cleaning
        df_clean['migrants'] = df_clean['migrants'].fillna(0)
        df_clean = df_clean[df_clean['migrants'] > 0]  # Remove countries with no migrants
        
        # Save to CSV
        output_path = 'dataset/migration.csv'
        df_clean.to_csv(output_path, index=False)
        print(f"✅ Data processed successfully! Saved to {output_path}")
        print(f"📊 Total countries with migrants: {len(df_clean)}")
        
        return df_clean
        
    except Exception as e:
        print(f"❌ Error processing data: {e}")
        print("Please check your file paths and structure")
        return None

if __name__ == "__main__":
    process_migration_data()