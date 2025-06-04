
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Recommendation } from '@/domain/entities/Recommendation';
import { IRecommendationService } from '@/domain/services/IRecommendationService';
import Container from '@/infrastructure/di/Container';

interface RecommendationState {
  recommendations: Recommendation[];
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

const initialState: RecommendationState = {
  recommendations: [],
  loading: false,
  error: null,
  lastFetch: null
};

// Async thunks
export const fetchRecommendations = createAsyncThunk(
  'recommendations/fetch',
  async ({ userId, insuranceType }: { userId: string; insuranceType?: string }) => {
    const service = Container.getInstance().get<IRecommendationService>('IRecommendationService');
    return await service.getRecommendations(userId, insuranceType);
  }
);

export const generateRecommendations = createAsyncThunk(
  'recommendations/generate',
  async (params: { userId: string; insuranceType: string; preferences: any; behavioralData?: any }) => {
    const service = Container.getInstance().get<IRecommendationService>('IRecommendationService');
    await service.generateRecommendations(params);
    return await service.getRecommendations(params.userId, params.insuranceType);
  }
);

export const updateRecommendationInteraction = createAsyncThunk(
  'recommendations/updateInteraction',
  async ({ recommendationId, interactionType }: { recommendationId: string; interactionType: 'viewed' | 'clicked' | 'purchased' }) => {
    const service = Container.getInstance().get<IRecommendationService>('IRecommendationService');
    await service.updateInteraction(recommendationId, interactionType);
    return { recommendationId, interactionType };
  }
);

const recommendationSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    clearRecommendations: (state) => {
      state.recommendations = [];
      state.error = null;
      state.lastFetch = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch recommendations
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload;
        state.lastFetch = Date.now();
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch recommendations';
      })
      
      // Generate recommendations
      .addCase(generateRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload;
        state.lastFetch = Date.now();
      })
      .addCase(generateRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to generate recommendations';
      })
      
      // Update interaction
      .addCase(updateRecommendationInteraction.fulfilled, (state, action) => {
        const { recommendationId, interactionType } = action.payload;
        const recommendation = state.recommendations.find(rec => rec.id === recommendationId);
        if (recommendation) {
          if (interactionType === 'viewed') recommendation.isViewed = true;
          if (interactionType === 'clicked') recommendation.isClicked = true;
          if (interactionType === 'purchased') recommendation.isPurchased = true;
        }
      });
  }
});

export const { clearRecommendations, clearError } = recommendationSlice.actions;
export default recommendationSlice.reducer;
