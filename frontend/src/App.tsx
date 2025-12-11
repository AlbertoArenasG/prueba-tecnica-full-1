import { useState, useEffect } from 'react';
import { CampaignTable } from './components/CampaignTable';
import { DateRangeForm } from './components/DateRangeForm';
import { Campaign } from './types/campaign';
import { getCampaigns, searchCampaignsByDate } from './api/campaigns';

function App() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);
    const [tipoCampania, setTipoCampania] = useState<string | undefined>();
    const [total, setTotal] = useState(0);
    const [dateFilter, setDateFilter] = useState<{ startDate: string; endDate: string } | null>(null);

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
                    <button
                        onClick={clearDateFilter}
                        className="mt-2 px-3 py-1 border rounded text-sm"
                    >
                        Clear date filter
                    </button>
                )}
            </div>

            <div className="form-group">
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
                        onRowClick={(campaign) => console.log('Selected campaign:', campaign)}
                    />
                    <div className="mt-4 flex items-center justify-between">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 border rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={page >= totalPages}
                            className="px-4 py-2 border rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default App;
