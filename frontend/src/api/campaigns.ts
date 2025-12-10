import axios from 'axios';
import { Campaign, CampaignDetail } from '../types/campaign';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

// Create axios instance with custom config
const api = axios.create({
    baseURL: API_URL,
    timeout: 5000,
});

// Add request interceptor for debugging
api.interceptors.request.use(
    (config) => {
        console.log('Making request to:', config.url);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
api.interceptors.response.use(
    (response) => {
        console.log('Received response:', response.data);
        return response;
    },
    (error) => {
        console.error('Response error:', error);
        return Promise.reject(error);
    }
);

export const getCampaigns = async (
    page: number,
    pageSize: number,
    tipoCampania?: string
): Promise<{ data: Campaign[]; total: number }> => {
    const skip = page * pageSize;
    const params = new URLSearchParams({
        skip: skip.toString(),
        limit: pageSize.toString(),
        ...(tipoCampania && { tipo_campania: tipoCampania }),
    });

    try {
        const response = await api.get(`/campaigns/?${params}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        throw error;
    }
};

export const getCampaignDetail = async (campaignId: string): Promise<CampaignDetail> => {
    const response = await api.get(`/campaigns/${campaignId}`);
    return response.data;
};

export const searchCampaignsByDate = async (
    startDate: string,
    endDate: string
): Promise<Campaign[]> => {
    const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
    });

    const response = await api.get(`/campaigns/search-by-date/?${params}`);
    return response.data;
};
