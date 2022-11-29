import { useHttp } from '../../hooks/http.hook';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
	filtersLoadingStatus: 'idle',
	filters: [],
	activeFilter: 'all',
}

export const fetchFilters = createAsyncThunk(
	'filters/fetchFilters',
	() => {
		const {request} = useHttp();
		return request("http://localhost:3001/filters");
	}
)

const filtersSlice = createSlice({
	name: 'filters',
	initialState,
	reducers: {
		filtersFetching: state => {
			state.filtersLoadingStatus = 'loading';
		},
		filtersFetched: (state, action) => {
			state.filters = action.payload;
			state.filtersLoadingStatus = 'idle';
		},
		filtersFetchingError: state => {
			state.filtersLoadingStatus = 'error';
		},
		activeFilterChange: (state, action) => {
			state.activeFilter = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchFilters.pending, state => {
				state.filtersLoadingStatus = 'loading';
			})
			.addCase(fetchFilters.fulfilled, (state, action) => {
				state.filters = action.payload;
				state.filtersLoadingStatus = 'idle';
			})
			.addCase(fetchFilters.rejected, (state, action) => {
				state.activeFilter = action.payload;
			})
	}
})

const {actions, reducer} = filtersSlice

export default reducer;
export const {
	filtersFetching,
	filtersFetched,
	filtersFetchingError,
	activeFilterChange,
} = actions;