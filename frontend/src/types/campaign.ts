export interface Campaign {
    name: string;
    tipo_campania: string;
    fecha_inicio: string;
    fecha_fin: string;
    universo_zona_metro: number;
    impactos_personas: number;
    impactos_vehiculos: number;
    frecuencia_calculada: number;
    frecuencia_promedio: number;
    alcance: number;
    nse_ab: number;
    nse_c: number;
    nse_cmas: number;
    nse_d: number;
    nse_dmas: number;
    nse_e: number;
    edad_0a14: number;
    edad_15a19: number;
    edad_20a24: number;
    edad_25a34: number;
    edad_35a44: number;
    edad_45a64: number;
    edad_65mas: number;
    hombres: number;
    mujeres: number;
}

export interface CampaignPeriod {
    id: number;
    campaign_name: string;
    period: string;
    impactos_periodo_personas: number;
    impactos_periodo_vehiculos: number;
}

export interface CampaignSite {
    id: number;
    campaign_name: string;
    codigo_del_sitio: string;
    tipo_de_mueble: string;
    tipo_de_anuncio: string;
    estado: string;
    municipio: string;
    zm: string;
    frecuencia_catorcenal: number;
    frecuencia_mensual: number;
    impactos_catorcenal: number;
    impactos_mensuales: number;
    alcance_mensual: number;
}

export interface CampaignDetail extends Campaign {
    periods: CampaignPeriod[];
    sites: CampaignSite[];
}
