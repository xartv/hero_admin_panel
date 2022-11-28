import { createReducer } from '@reduxjs/toolkit';

import {
	heroesFetching,
	heroesFetched,
	heroesFetchingError,
	heroDeleting,
	heroDeleted,
	heroDeletingError,
	heroAdd,
} from '../actions';

const initialState = {
	heroes: [],
	heroesLoadingStatus: 'idle',
	heroesDeletingStatus: 'idle',
}

const heroes = createReducer(initialState, builder => {
	builder
		.addCase(heroesFetching, state => {
			state.heroesLoadingStatus = 'loading';
		})
		.addCase(heroesFetched, (state, action) => {
			state.heroesLoadingStatus = 'idle';
			state.heroes = action.payload; 
		})
		.addCase(heroesFetchingError, state => {
			state.heroesLoadingStatus = 'error';
		})
		.addCase(heroAdd, (state, action) => {
			state.heroes.push(action.payload);
		})
		.addCase(heroDeleting, state => {
			state.heroesDeletingStatus = 'deleting';
		})
		.addCase(heroDeleted, (state, action) => {
			state.heroesDeletingStatus = 'idle';
			state.heroes = state.heroes.filter(hero => hero.id !== action.payload);
		})
		.addCase(heroDeletingError, state => {
			state.heroesDeletingStatus = 'error';
		})
		.addDefaultCase(() => {});
})

export default heroes;