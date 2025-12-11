import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CampaignDetail } from '../types/campaign';
import { format } from 'date-fns';

interface Props {
    data: CampaignDetail | null;
    onClose: () => void;
    loading: boolean;
    open: boolean;
}

const formatNumber = (value: number | null | undefined) =>
    typeof value === 'number' ? value.toLocaleString() : '—';

const formatDate = (value: string | null | undefined) => {
    if (!value) return '—';
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? '—' : format(parsed, 'dd/MM/yyyy');
};

export const CampaignDetailModal: React.FC<Props> = ({ data, onClose, loading, open }) => {
    useEffect(() => {
        if (!open) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [open, onClose]);

    if (!open) return null;

    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <p className="modal-type">{data?.tipo_campania?.toUpperCase()}</p>
                        <h3 className="modal-title">{data?.name}</h3>
                        <p className="modal-dates">
                            {formatDate(data?.fecha_inicio)} – {formatDate(data?.fecha_fin)}
                        </p>
                    </div>
                    <button className="modal-close" onClick={onClose} aria-label="Cerrar detalle">
                        ✕
                    </button>
                </div>

                {loading || !data ? (
                    <div className="modal-loading">Cargando detalle…</div>
                ) : (
                    <div className="modal-content">
                        <section>
                            <h4 className="section-heading">Resumen general</h4>
                            <div className="summary-grid">
                                <SummaryCard label="Impactos (personas)" value={formatNumber(data.general_summary?.impactos_personas)} />
                                <SummaryCard label="Impactos (vehículos)" value={formatNumber(data.general_summary?.impactos_vehiculos)} />
                                <SummaryCard label="Alcance" value={formatNumber(data.general_summary?.alcance)} />
                                <SummaryCard label="Frecuencia calculada" value={data.general_summary?.frecuencia_calculada ?? '—'} />
                                <SummaryCard label="Frecuencia promedio" value={data.general_summary?.frecuencia_promedio ?? '—'} />
                            </div>
                        </section>

                        <section className="two-column">
                            <GeneralChart data={data} />
                            <SitesChart data={data} />
                        </section>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

const GeneralChart: React.FC<{ data: CampaignDetail }> = ({ data }) => {
    const periods = data.periods.slice(0, 6);
    return (
        <div className="chart-card">
            <div className="chart-header">
                <h4 className="section-heading">Impactos por periodo</h4>
                <p className="section-subtitle">Comparativa personas vs vehículos</p>
            </div>
            <div className="chart-bars">
                {periods.map((period) => {
                    const maxValue = Math.max(
                        period.impactos_periodo_personas ?? 0,
                        period.impactos_periodo_vehiculos ?? 0
                    );
                    return (
                        <div key={period.id} className="chart-bars__row">
                            <span className="chart-bars__label">{period.period}</span>
                            <div className="chart-bars__track">
                                <div
                                    className="chart-bars__value chart-bars__value--primary"
                                    style={{ width: `${Math.min(100, (period.impactos_periodo_personas ?? 0) / maxValue * 100)}%` }}
                                />
                                <div
                                    className="chart-bars__value chart-bars__value--secondary"
                                    style={{ width: `${Math.min(100, (period.impactos_periodo_vehiculos ?? 0) / maxValue * 100)}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const SitesChart: React.FC<{ data: CampaignDetail }> = ({ data }) => {
    const topSites = data.sites.slice(0, 6);
    return (
        <div className="chart-card">
            <div className="chart-header">
                <h4 className="section-heading">Sitios con más impactos</h4>
                <p className="section-subtitle">Basado en impactos mensuales registrados</p>
            </div>
            <div className="chart-list">
                {topSites.map((site) => (
                    <div key={site.id} className="chart-list__row">
                        <div>
                            <p className="chart-list__title">{site.codigo_del_sitio}</p>
                            <p className="chart-list__subtitle">{site.tipo_de_anuncio ?? '—'}</p>
                        </div>
                        <div className="chart-list__value">
                            {formatNumber(site.impactos_mensuales)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SummaryCard: React.FC<{ label: string; value: number | string }> = ({ label, value }) => (
    <div className="summary-card">
        <p className="summary-card__label">{label}</p>
        <p className="summary-card__value">{value}</p>
    </div>
);
