from pydantic import BaseModel
from datetime import date
from typing import List, Optional

class CampaignPeriodBase(BaseModel):
    period: str
    impactos_periodo_personas: Optional[int] = None
    impactos_periodo_vehiculos: Optional[int] = None

class CampaignPeriod(CampaignPeriodBase):
    id: int
    campaign_name: str

    model_config = {
        "from_attributes": True
    }

class CampaignSiteBase(BaseModel):
    codigo_del_sitio: str
    tipo_de_mueble: Optional[str] = None
    tipo_de_anuncio: Optional[str] = None
    estado: Optional[str] = None
    municipio: Optional[str] = None
    zm: Optional[str] = None
    frecuencia_catorcenal: Optional[float] = None
    frecuencia_mensual: Optional[float] = None
    impactos_catorcenal: Optional[int] = None
    impactos_mensuales: Optional[int] = None
    alcance_mensual: Optional[float] = None

class CampaignSite(CampaignSiteBase):
    id: int
    campaign_name: str

    model_config = {
        "from_attributes": True
    }

class GeneralSummary(BaseModel):
    impactos_personas: Optional[int] = None
    impactos_vehiculos: Optional[int] = None
    alcance: Optional[int] = None
    frecuencia_calculada: Optional[float] = None
    frecuencia_promedio: Optional[float] = None

class PeriodSummary(BaseModel):
    total_periodos: int
    impactos_personas: int
    impactos_vehiculos: int

class SiteSummary(BaseModel):
    total_sitios: int
    impactos_mensuales: int
    impactos_catorcenal: int
    alcance_mensual_promedio: float

class CampaignBase(BaseModel):
    name: str
    tipo_campania: str
    fecha_inicio: date
    fecha_fin: date
    universo_zona_metro: Optional[int] = None
    impactos_personas: Optional[int] = None
    impactos_vehiculos: Optional[int] = None
    frecuencia_calculada: Optional[float] = None
    frecuencia_promedio: Optional[float] = None
    alcance: Optional[int] = None
    nse_ab: Optional[float] = None
    nse_c: Optional[float] = None
    nse_cmas: Optional[float] = None
    nse_d: Optional[float] = None
    nse_dmas: Optional[float] = None
    nse_e: Optional[float] = None
    edad_0a14: Optional[float] = None
    edad_15a19: Optional[float] = None
    edad_20a24: Optional[float] = None
    edad_25a34: Optional[float] = None
    edad_35a44: Optional[float] = None
    edad_45a64: Optional[float] = None
    edad_65mas: Optional[float] = None
    hombres: Optional[float] = None
    mujeres: Optional[float] = None

class Campaign(CampaignBase):
    model_config = {
        "from_attributes": True
    }

class CampaignDetail(Campaign):
    periods: List[CampaignPeriod]
    sites: List[CampaignSite]
    general_summary: GeneralSummary
    period_summary: PeriodSummary
    site_summary: SiteSummary

    model_config = {
        "from_attributes": True
    }
