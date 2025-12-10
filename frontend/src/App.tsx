import { useState, useEffect } from 'react';
import { CampaignTable } from './components/CampaignTable';
import { DateRangeForm } from './components/DateRangeForm';
import { Campaign } from './types/campaign';
import { getCampaigns, searchCampaignsByDate } from './api/campaigns';

function App() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [pageSize] = useState(10);
    const [tipoCampania, setTipoCampania] = useState<string | undefined>();

    useEffect(() => {
        loadCampaigns();
    }, [page, pageSize, tipoCampania]);

    const loadCampaigns = async () => {
        try {
            setLoading(true);
            setError(null); // Clear any previous errors
            console.log('Loading campaigns...', { page, pageSize, tipoCampania });
            const response = await getCampaigns(page, pageSize, tipoCampania);
            console.log('Campaigns loaded:', response);
            if (Array.isArray(response.data)) {
                setCampaigns(response.data);
            } else {
                console.error('Invalid response format:', response);
                setError('Invalid data format received from server');
            }
        } catch (err) {
            console.error('Error in loadCampaigns:', err);
            setError(err instanceof Error ? err.message : 'Error loading campaigns');
            setCampaigns([]); // Reset campaigns on error
        } finally {
            setLoading(false);
        }
    };

    const handleDateRangeSubmit = async (startDate: string, endDate: string) => {
        try {
            setLoading(true);
            const data = await searchCampaignsByDate(startDate, endDate);
            setCampaigns(data);
        } catch (err) {
            setError('Error searching campaigns');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleTipoCampaniaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setTipoCampania(value === '' ? undefined : value);
        setPage(0);
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
                    <div className="mt-4 flex justify-between">
                        <button
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="px-4 py-2 border rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={campaigns.length < pageSize}
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
