import {createSlice} from '@reduxjs/toolkit';

const initialState = {
	heroes: [],
	heroesLoadingStatus: 'idle',
	heroesDeletingStatus: 'idle',
}

const heroesSlice = createSlice({
	name: 'heroes',
	initialState,
	reducers: {
		heroesFetching: state => {
			state.heroesLoadingStatus = 'loading'
		},
		heroesFetched: (state, action) => {
			state.heroesLoadingStatus = 'idle';
			state.heroes = action.payload; 
		},
		heroesFetchingError: state => {
			state.heroesLoadingStatus = 'error';
		},
		heroAdd: (state, action) => {
			state.heroes.push(action.payload);
		},
		heroDeleting: state => {
			state.heroesDeletingStatus = 'deleting';
		},
		heroDeleted: (state, action) => {
			state.heroesDeletingStatus = 'idle';
			state.heroes = state.heroes.filter(hero => hero.id !== action.payload);
		},
		heroDeletingError: state => {
			state.heroesDeletingStatus = 'error';
		},
	}
});

const {actions, reducer} = heroesSlice;

export default reducer;
export const {
	heroesFetching,
	heroesFetched,
	heroesFetchingError,
	heroAdd,
	heroDeleting,
	heroDeleted,
	heroDeletingError,
} = actions