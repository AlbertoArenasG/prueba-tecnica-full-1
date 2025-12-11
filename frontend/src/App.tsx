import { useState, useEffect } from 'react';
import { CampaignTable } from './components/CampaignTable';
import { DateRangeForm } from './components/DateRangeForm';
import { Campaign, CampaignDetail } from './types/campaign';
import { getCampaigns, getCampaignDetail, searchCampaignsByDate } from './api/campaigns';
import { CampaignDetailModal } from './components/CampaignDetailModal';
import { SkeletonTable } from './components/SkeletonTable';

function App() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [tipoCampania, setTipoCampania] = useState<string | undefined>();
    const [total, setTotal] = useState(0);
    const [dateFilter, setDateFilter] = useState<{ startDate: string; endDate: string } | null>(null);
    const [selectedDetail, setSelectedDetail] = useState<CampaignDetail | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    useEffect(() => {
        loadCampaigns();
    }, [page, pageSize, tipoCampania, dateFilter]);

    const loadCampaigns = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = dateFilter
                ? await searchCampaignsByDate({
                    startDate: dateFilter.startDate,
                    endDate: dateFilter.endDate,
                    page,
                    limit: pageSize,
                    tipoCampania,
                })
                : await getCampaigns({ page, limit: pageSize, tipoCampania });

            setCampaigns(response.data);
            setTotal(response.total);
        } catch (err) {
            console.error('Error loading campaigns:', err);
            setError(err instanceof Error ? err.message : 'Error loading campaigns');
            setCampaigns([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    const handleDateRangeSubmit = (startDate: string, endDate: string) => {
        setPage(1);
        setDateFilter({ startDate, endDate });
    };

    const handleTipoCampaniaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setTipoCampania(value === '' ? undefined : value);
        setPage(1);
    };

    const clearDateFilter = () => {
        setDateFilter(null);
        setPage(1);
    };

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const handleRowClick = async (campaign: Campaign) => {
        try {
            setDetailLoading(true);
            setDetailModalOpen(true);
            setSelectedDetail(null);
            const detail = await getCampaignDetail(campaign.name);
            setSelectedDetail(detail);
        } catch (err) {
            console.error('Error loading campaign detail', err);
            setError(err instanceof Error ? err.message : 'Error loading campaign detail');
        } finally {
            setDetailLoading(false);
        }
    };

    const closeDetail = () => {
        setDetailModalOpen(false);
        setSelectedDetail(null);
    };

    if (error) {
        return <div className="text-red-600">{error}</div>;
    }

    return (
        <div className="app-container">
            <h1 className="app-title">Analítica de Campañas</h1>

            <div className="filters-panel">
                <div className="filters-grid">
                    <div className="filters-grid__block">
                        <div className="filters-grid__item">
                            <h2 className="section-title">Búsqueda por rango de fechas</h2>
                            <DateRangeForm onSubmit={handleDateRangeSubmit} />
                        </div>
                        <div className="filters-grid__row">
                            <div className="filters-grid__input">
                                <label htmlFor="tipoCampania" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo de campaña
                                </label>
                                <select
                                    id="tipoCampania"
                                    value={tipoCampania || ''}
                                    onChange={handleTipoCampaniaChange}
                                    className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">Todas</option>
                                    <option value="mensual">Mensual</option>
                                    <option value="catorcenal">Catorcenal</option>
                                </select>
                            </div>
                            <div className="filters-grid__input">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Resultados por página</label>
                                <select
                                    value={pageSize}
                                    onChange={(e) => {
                                        setPage(1);
                                        setPageSize(Number(e.target.value));
                                    }}
                                    className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    {[5, 10, 15].map(size => (
                                        <option key={size} value={size}>{size} resultados</option>
                                    ))}
                                </select>
                            </div>
                            {dateFilter && (
                                <button
                                    onClick={clearDateFilter}
                                    className="filters-grid__clear rounded-md px-3 py-2 text-sm font-medium text-gray-700"
                                >
                                    Limpiar filtro
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <SkeletonTable columns={7} rows={pageSize} />
            ) : (
                <>
                    <CampaignTable
                        data={campaigns}
                        onRowClick={handleRowClick}
                    />
                    <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="pill-button"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={page >= totalPages}
                                className="pill-button"
                            >
                                Siguiente
                            </button>
                        </div>
                        <span className="text-sm text-gray-600">
                            Página {page} de {totalPages}
                        </span>
                    </div>
                </>
            )}
            <CampaignDetailModal
                open={detailModalOpen}
                data={selectedDetail}
                loading={detailLoading}
                onClose={closeDetail}
            />
        </div>
    );
}

export default App;
