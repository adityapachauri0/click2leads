import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5003/api';

interface DashboardMetrics {
  totalLeads: number;
  newLeads: number;
  conversionRate: number;
  revenue: number;
  activeClients: number;
  campaignsRunning: number;
  averageROI: number;
  monthlyGrowth: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
  }[];
}

interface DashboardState {
  metrics: DashboardMetrics;
  revenueChart: ChartData | null;
  leadsChart: ChartData | null;
  conversionChart: ChartData | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: DashboardState = {
  metrics: {
    totalLeads: 0,
    newLeads: 0,
    conversionRate: 0,
    revenue: 0,
    activeClients: 0,
    campaignsRunning: 0,
    averageROI: 0,
    monthlyGrowth: 0,
  },
  revenueChart: null,
  leadsChart: null,
  conversionChart: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
};

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (dateRange?: { start: string; end: string }) => {
    const response = await axios.get(`${API_URL}/dashboard`, { params: dateRange });
    return response.data;
  }
);

export const fetchMetrics = createAsyncThunk(
  'dashboard/fetchMetrics',
  async () => {
    const response = await axios.get(`${API_URL}/dashboard/metrics`);
    return response.data;
  }
);

export const fetchChartData = createAsyncThunk(
  'dashboard/fetchCharts',
  async (type: 'revenue' | 'leads' | 'conversion') => {
    const response = await axios.get(`${API_URL}/dashboard/charts/${type}`);
    return { type, data: response.data };
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    updateMetric: (state, action) => {
      state.metrics = { ...state.metrics, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboard Data
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.metrics = action.payload.metrics;
        state.revenueChart = action.payload.revenueChart;
        state.leadsChart = action.payload.leadsChart;
        state.conversionChart = action.payload.conversionChart;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch dashboard data';
      })
      // Fetch Metrics
      .addCase(fetchMetrics.fulfilled, (state, action) => {
        state.metrics = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      // Fetch Chart Data
      .addCase(fetchChartData.fulfilled, (state, action) => {
        const { type, data } = action.payload;
        if (type === 'revenue') state.revenueChart = data;
        else if (type === 'leads') state.leadsChart = data;
        else if (type === 'conversion') state.conversionChart = data;
      });
  },
});

export const { updateMetric, clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;