import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5003/api';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  source: string;
  createdAt: string;
  updatedAt: string;
}

interface LeadsState {
  leads: Lead[];
  selectedLead: Lead | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  filters: {
    status: string;
    dateRange: string;
    service: string;
  };
}

const initialState: LeadsState = {
  leads: [],
  selectedLead: null,
  isLoading: false,
  error: null,
  totalCount: 0,
  filters: {
    status: 'all',
    dateRange: 'all',
    service: 'all',
  },
};

export const fetchLeads = createAsyncThunk(
  'leads/fetchAll',
  async (params?: { status?: string; dateRange?: string; service?: string }) => {
    const response = await axios.get(`${API_URL}/leads`, { params });
    return response.data;
  }
);

export const createLead = createAsyncThunk(
  'leads/create',
  async (leadData: Partial<Lead>) => {
    const response = await axios.post(`${API_URL}/leads`, leadData);
    return response.data;
  }
);

export const updateLead = createAsyncThunk(
  'leads/update',
  async ({ id, data }: { id: string; data: Partial<Lead> }) => {
    const response = await axios.put(`${API_URL}/leads/${id}`, data);
    return response.data;
  }
);

export const deleteLead = createAsyncThunk(
  'leads/delete',
  async (id: string) => {
    await axios.delete(`${API_URL}/leads/${id}`);
    return id;
  }
);

export const updateLeadStatus = createAsyncThunk(
  'leads/updateStatus',
  async ({ id, status }: { id: string; status: Lead['status'] }) => {
    const response = await axios.patch(`${API_URL}/leads/${id}/status`, { status });
    return response.data;
  }
);

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<LeadsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    selectLead: (state, action: PayloadAction<Lead | null>) => {
      state.selectedLead = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Leads
      .addCase(fetchLeads.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leads = action.payload.leads;
        state.totalCount = action.payload.total;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch leads';
      })
      // Create Lead
      .addCase(createLead.fulfilled, (state, action) => {
        state.leads.unshift(action.payload);
        state.totalCount += 1;
      })
      // Update Lead
      .addCase(updateLead.fulfilled, (state, action) => {
        const index = state.leads.findIndex(lead => lead.id === action.payload.id);
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
      })
      // Delete Lead
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.leads = state.leads.filter(lead => lead.id !== action.payload);
        state.totalCount -= 1;
      })
      // Update Status
      .addCase(updateLeadStatus.fulfilled, (state, action) => {
        const index = state.leads.findIndex(lead => lead.id === action.payload.id);
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
      });
  },
});

export const { setFilters, selectLead, clearError } = leadsSlice.actions;
export default leadsSlice.reducer;