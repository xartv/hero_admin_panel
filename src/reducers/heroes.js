const initialState = {
	heroes: [],
	heroesLoadingStatus: 'idle',
	heroesDeletingStatus: 'idle',
}

const heroes = (state = initialState, action) => {
	switch (action.type) {
			case 'HEROES_FETCHING':
				return {
					...state,
					heroesLoadingStatus: 'loading'
				}
			case 'HEROES_FETCHED':
				return {
					...state,
					heroes: action.payload,
					heroesLoadingStatus: 'idle'
				}
			case 'HEROES_FETCHING_ERROR':
				return {
					...state,
					heroesLoadingStatus: 'error'
				}
			case 'HEROES_DELETING':
				return {
					...state,
					heroesDeletingStatus: 'deleting'
				}
			case 'HEROES_DELETED':
				return {
					...state,
					heroesDeletingStatus: 'idle',
					heroes: state.heroes.filter(hero => hero.id !== action.payload),
				}
			case 'HEROES_DELETING_ERROR':
				return {
					...state,
					heroesDeletingStatus: 'error'
				}
			case 'HERO_ADD':
				return {
					...state,
					heroes: [...state.heroes, action.payload],
				}
			default: return state
	}
}

export default heroes;