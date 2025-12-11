import { useState, useEffect } from 'react';
import { CampaignTable } from './components/CampaignTable';
import { DateRangeForm } from './components/DateRangeForm';
import { Campaign, CampaignDetail } from './types/campaign';
import { getCampaigns, getCampaignDetail, searchCampaignsByDate } from './api/campaigns';
import { CampaignDetailModal } from './components/CampaignDetailModal';

function App() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);
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
            <h1 className="app-title">Campaign Analytics</h1>

            <div className="section">
                <h2 className="section-title">Search by Date Range</h2>
                <DateRangeForm onSubmit={handleDateRangeSubmit} />
                {dateFilter && (
                    <div className="mt-2">
                        <button
                            onClick={clearDateFilter}
                            className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                        >
                            Clear date filter
                        </button>
                    </div>
                )}
            </div>

            <div className="form-group max-w-md">
                <label htmlFor="tipoCampania">
                    Campaign Type
                </label>
                <select
                    id="tipoCampania"
                    value={tipoCampania || ''}
                    onChange={handleTipoCampaniaChange}
                >
                    <option value="">All Types</option>
                    <option value="mensual">Mensual</option>
                    <option value="catorcenal">Catorcenal</option>
                </select>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <CampaignTable
                        data={campaigns}
                        onRowClick={handleRowClick}
                    />
                    <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={page >= totalPages}
                                className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Next
                            </button>
                        </div>
                        <span className="text-sm text-gray-600">
                            Page {page} of {totalPages}
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
