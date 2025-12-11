export interface Campaign {
    name: string;
    tipo_campania: string;
    fecha_inicio: string;
    fecha_fin: string;
    universo_zona_metro: number | null;
    impactos_personas: number | null;
    impactos_vehiculos: number | null;
    frecuencia_calculada: number | null;
    frecuencia_promedio: number | null;
    alcance: number | null;
    nse_ab: number | null;
    nse_c: number | null;
    nse_cmas: number | null;
    nse_d: number | null;
    nse_dmas: number | null;
    nse_e: number | null;
    edad_0a14: number | null;
    edad_15a19: number | null;
    edad_20a24: number | null;
    edad_25a34: number | null;
    edad_35a44: number | null;
    edad_45a64: number | null;
    edad_65mas: number | null;
    hombres: number | null;
    mujeres: number | null;
}

export interface CampaignPeriod {
    id: number;
    campaign_name: string;
    period: string;
    impactos_periodo_personas: number | null;
    impactos_periodo_vehiculos: number | null;
}

export interface CampaignSite {
    id: number;
    campaign_name: string;
    codigo_del_sitio: string;
    tipo_de_mueble: string | null;
    tipo_de_anuncio: string | null;
    estado: string | null;
    municipio: string | null;
    zm: string | null;
    frecuencia_catorcenal: number | null;
    frecuencia_mensual: number | null;
    impactos_catorcenal: number | null;
    impactos_mensuales: number | null;
    alcance_mensual: number | null;
}

export interface GeneralSummary {
    impactos_personas: number | null;
    impactos_vehiculos: number | null;
    alcance: number | null;
    frecuencia_calculada: number | null;
    frecuencia_promedio: number | null;
}

export interface PeriodSummary {
    total_periodos: number;
    impactos_personas: number;
    impactos_vehiculos: number;
}

export interface SiteSummary {
    total_sitios: number;
    impactos_mensuales: number;
    impactos_catorcenal: number;
    alcance_mensual_promedio: number;
}

export interface CampaignDetail extends Campaign {
    periods: CampaignPeriod[];
    sites: CampaignSite[];
    general_summary: GeneralSummary;
    period_summary: PeriodSummary;
    site_summary: SiteSummary;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}
