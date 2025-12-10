import os
from pathlib import Path
from datetime import datetime

import pandas as pd

from app.database import SessionLocal, engine
from app.models import Base, Campaign, CampaignPeriod, CampaignSite

DATA_DIR = Path(os.getenv("DATA_DIR", "data"))

def clean_number(x):
    if isinstance(x, str) and '-' in x:
        # Handle cases where numbers are formatted as dates
        return int(x.split('-')[0])
    return x

def read_csv(file_name: str) -> pd.DataFrame:
    file_path = DATA_DIR / file_name
    if not file_path.exists():
        raise FileNotFoundError(f"No se encontró el archivo requerido: {file_path}")
    return pd.read_csv(file_path)

def load_data():
    # Reset schema to avoid duplicados
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Read and clean agrupado data
        df_agrupado = read_csv('bd_campanias_agrupado.csv')
        df_agrupado['name_norm'] = df_agrupado['name'].astype(str).str.strip().str.lower()
        df_agrupado = df_agrupado.drop_duplicates(subset=['name_norm']).drop(columns=['name_norm'])

        # Read and clean periodos data
        df_periodos = read_csv('bd_campanias_periodos.csv')
        df_periodos['name_norm'] = df_periodos['name'].astype(str).str.strip().str.lower()
        df_periodos['period_norm'] = df_periodos['period'].astype(str).str.strip().str.lower()
        df_periodos = df_periodos.drop_duplicates(subset=['name_norm', 'period_norm']).drop(columns=['name_norm', 'period_norm'])
        vehicles_col = 'impactos_periodo_vehículos'
        if vehicles_col not in df_periodos.columns:
            vehicles_col = 'impactos_periodo_vehiculos'
        df_periodos['impactos_periodo_vehiculos'] = df_periodos[vehicles_col].apply(clean_number)

        # Read and clean sitios data
        df_sitios = read_csv('bd_campanias_sitios.csv')
        df_sitios['name_norm'] = df_sitios['name'].astype(str).str.strip().str.lower()
        df_sitios['codigo_norm'] = df_sitios['codigo_del_sitio'].astype(str).str.strip().str.lower()
        df_sitios = df_sitios.drop_duplicates(subset=['name_norm', 'codigo_norm']).drop(columns=['name_norm', 'codigo_norm'])

        # Process campaigns
        for _, row in df_agrupado.iterrows():
            name = str(row['name']).strip()
            campaign = Campaign(
                name=name,
                tipo_campania=row['tipo_campania'],
                fecha_inicio=datetime.strptime(row['fecha_inicio'], '%Y-%m-%d').date(),
                fecha_fin=datetime.strptime(row['fecha_fin'], '%Y-%m-%d').date(),
                universo_zona_metro=row['universo_zona_metro'],
                impactos_personas=row['impactos_personas'],
                impactos_vehiculos=row['impactos_vehiculos'],
                frecuencia_calculada=row['frecuencia_calculada'],
                frecuencia_promedio=row['frecuencia_promedio'],
                alcance=row['alcance'],
                nse_ab=row['nse_ab'],
                nse_c=row['nse_c'],
                nse_cmas=row['nse_cmas'],
                nse_d=row['nse_d'],
                nse_dmas=row['nse_dmas'],
                nse_e=row['nse_e'],
                edad_0a14=row['edad_0a14'],
                edad_15a19=row['edad_15a19'],
                edad_20a24=row['edad_20a24'],
                edad_25a34=row['edad_25a34'],
                edad_35a44=row['edad_35a44'],
                edad_45a64=row['edad_45a64'],
                edad_65mas=row['edad_65mas'],
                hombres=row['hombres'],
                mujeres=row['mujeres']
            )
            db.add(campaign)
        
        # Commit campaigns first
        db.commit()

        # Process periods
        for _, row in df_periodos.iterrows():
            name = str(row['name']).strip()
            period_value = str(row['period']).strip()
            period = CampaignPeriod(
                campaign_name=name,
                period=period_value,
                impactos_periodo_personas=row['impactos_periodo_personas'],
                impactos_periodo_vehiculos=row['impactos_periodo_vehiculos']
            )
            db.add(period)

        # Process sites
        for _, row in df_sitios.iterrows():
            name = str(row['name']).strip()
            site_code = str(row['codigo_del_sitio']).strip()
            site = CampaignSite(
                campaign_name=name,
                codigo_del_sitio=site_code,
                tipo_de_mueble=row['tipo_de_mueble'],
                tipo_de_anuncio=row['tipo_de_anuncio'],
                estado=row['estado'],
                municipio=row['municipio'],
                zm=row['zm'],
                frecuencia_catorcenal=row['frecuencia_catorcenal'],
                frecuencia_mensual=row['frecuencia_mensual'],
                impactos_catorcenal=row['impactos_catorcenal'],
                impactos_mensuales=row['impactos_mensuales'],
                alcance_mensual=row['alcance_mensual']
            )
            db.add(site)

        # Commit periods and sites
        db.commit()
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    load_data()
