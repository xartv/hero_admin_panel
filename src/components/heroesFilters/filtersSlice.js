import { useHttp } from '../../hooks/http.hook';
import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';

const filtersAdapter = createEntityAdapter();

const initialState = filtersAdapter.getInitialState({
	filtersLoadingStatus: 'idle',
	activeFilter: 'all',
})

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
				filtersAdapter.setAll(state, action.payload);
				state.filtersLoadingStatus = 'idle';
			})
			.addCase(fetchFilters.rejected, state => {
				state.filtersLoadingStatus = 'error';
			})
			.addDefaultCase(() => {});
	}
})

const {actions, reducer} = filtersSlice

export const {selectAll} = filtersAdapter.getSelectors(state => state.filters); // сразу вытаскиваем все фильтры через селектор, этот селектор передаем в useSelector в нужном компоненте, результатом сразу придет объект с фильтрами

export default reducer;
export const {
	filtersFetching,
	filtersFetched,
	filtersFetchingError,
	activeFilterChange,
} = actions;