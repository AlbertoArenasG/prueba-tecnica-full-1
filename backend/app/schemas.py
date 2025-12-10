from pydantic import BaseModel
from datetime import date
from typing import List, Optional

class CampaignPeriodBase(BaseModel):
    period: str
    impactos_periodo_personas: int
    impactos_periodo_vehiculos: int

class CampaignPeriod(CampaignPeriodBase):
    id: int
    campaign_name: str

    class Config:
        orm_mode = True

class CampaignSiteBase(BaseModel):
    codigo_del_sitio: str
    tipo_de_mueble: str
    tipo_de_anuncio: str
    estado: str
    municipio: str
    zm: str
    frecuencia_catorcenal: float
    frecuencia_mensual: float
    impactos_catorcenal: int
    impactos_mensuales: int
    alcance_mensual: float

class CampaignSite(CampaignSiteBase):
    id: int
    campaign_name: str

    class Config:
        orm_mode = True

class CampaignBase(BaseModel):
    name: str
    tipo_campania: str
    fecha_inicio: date
    fecha_fin: date
    universo_zona_metro: int
    impactos_personas: int
    impactos_vehiculos: int
    frecuencia_calculada: float
    frecuencia_promedio: float
    alcance: int
    nse_ab: float
    nse_c: float
    nse_cmas: float
    nse_d: float
    nse_dmas: float
    nse_e: float
    edad_0a14: float
    edad_15a19: float
    edad_20a24: float
    edad_25a34: float
    edad_35a44: float
    edad_45a64: float
    edad_65mas: float
    hombres: float
    mujeres: float

class Campaign(CampaignBase):
    class Config:
        orm_mode = True

class CampaignDetail(Campaign):
    periods: List[CampaignPeriod]
    sites: List[CampaignSite]

    class Config:
        orm_mode = True
