// src/providers/restDataProvider.ts
import axios from "axios";
import { DataProvider } from "@refinedev/core";

const API_URL = "https://api.example.com"; // Replace with your API URL

const restDataProvider: DataProvider = {
    getApiUrl: () => API_URL,
    getList: async ({ resource, pagination, filters, sort }) => {
        const response = await axios.get(`${API_URL}/${resource}`, {
            params: {
                _page: pagination?.current,
                _limit: pagination?.pageSize,
                _sort: sort?.[0]?.field,
                _order: sort?.[0]?.order,
                ...filters,
            },
        });
        return {
            data: response.data,
            total: parseInt(response.headers["x-total-count"], 10),
        };
    },
    getOne: async ({ resource, id }) => {
        const response = await axios.get(`${API_URL}/${resource}/${id}`);
        return { data: response.data };
    },
    create: async ({ resource, variables }) => {
        const response = await axios.post(`${API_URL}/${resource}`, variables);
        return { data: response.data };
    },
    update: async ({ resource, id, variables }) => {
        const response = await axios.put(`${API_URL}/${resource}/${id}`, variables);
        return { data: response.data };
    },
    deleteOne: async ({ resource, id }) => {
        const response = await axios.delete(`${API_URL}/${resource}/${id}`);
        return { data: response.data };
    },
    // Implement other methods as needed
};

export default restDataProvider;
