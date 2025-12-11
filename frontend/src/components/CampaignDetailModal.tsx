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
                            <div className="data-block">
                                <div className="data-block__header">
                                    <div>
                                        <h4 className="section-heading">Desempeño por periodo</h4>
                                        <p className="section-subtitle">
                                            {data.period_summary?.total_periodos ?? 0} periodo(s) • {formatNumber(data.period_summary?.impactos_personas)} personas
                                        </p>
                                    </div>
                                </div>
                                <div className="data-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Periodo</th>
                                                <th className="text-right">Personas</th>
                                                <th className="text-right">Vehículos</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.periods.slice(0, 6).map(period => (
                                                <tr key={period.id}>
                                                    <td>{period.period}</td>
                                                    <td className="text-right">{formatNumber(period.impactos_periodo_personas)}</td>
                                                    <td className="text-right">{formatNumber(period.impactos_periodo_vehiculos)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="data-block">
                                <div className="data-block__header">
                                    <div>
                                        <h4 className="section-heading">Sitios destacados</h4>
                                        <p className="section-subtitle">
                                            {data.site_summary?.total_sitios ?? 0} sitio(s) • Alcance promedio {formatNumber(data.site_summary?.alcance_mensual_promedio)}
                                        </p>
                                    </div>
                                </div>
                                <div className="data-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Código</th>
                                                <th>Tipo</th>
                                                <th className="text-right">Impactos mensuales</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.sites.slice(0, 6).map(site => (
                                                <tr key={site.id}>
                                                    <td>{site.codigo_del_sitio}</td>
                                                    <td>{site.tipo_de_anuncio ?? '—'}</td>
                                                    <td className="text-right">{formatNumber(site.impactos_mensuales)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

const SummaryCard: React.FC<{ label: string; value: number | string }> = ({ label, value }) => (
    <div className="summary-card">
        <p className="summary-card__label">{label}</p>
        <p className="summary-card__value">{value}</p>
    </div>
);
