import axios from 'axios';
import { Campaign, CampaignDetail, PaginatedResponse } from '../types/campaign';

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

interface ListParams {
    page?: number;
    limit?: number;
    tipoCampania?: string;
}

interface DateSearchParams extends ListParams {
    startDate: string;
    endDate: string;
}

export const getCampaigns = async ({
    page = 1,
    limit = 5,
    tipoCampania,
}: ListParams): Promise<PaginatedResponse<Campaign>> => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(tipoCampania && { tipo_campania: tipoCampania }),
    });

    const response = await api.get(`/campaigns/?${params.toString()}`);
    return response.data;
};

export const getCampaignDetail = async (campaignId: string): Promise<CampaignDetail> => {
    const response = await api.get(`/campaigns/${campaignId}`);
    return response.data;
};

export const searchCampaignsByDate = async ({
    startDate,
    endDate,
    page = 1,
    limit = 5,
    tipoCampania,
}: DateSearchParams): Promise<PaginatedResponse<Campaign>> => {
    const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        page: page.toString(),
        limit: limit.toString(),
        ...(tipoCampania && { tipo_campania: tipoCampania }),
    });

    const response = await api.get(`/campaigns/search-by-date?${params.toString()}`);
    return response.data;
};
