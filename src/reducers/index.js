const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle',
		heroesDeletingStatus: 'idle',
		filtersLoadingStatus: 'idle',
    filters: [],
		activeFilter: 'all',
}

const reducer = (state = initialState, action) => {
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
						heroes: action.payload,
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
				case 'FILTERS_FETCHING':
					return {
						...state,
						filtersLoadingStatus: 'loading'
					}
					case 'FILTERS_FETCHED':
						return {
							...state,
							filters: action.payload,
							filtersLoadingStatus: 'idle'
						}
					case 'FILTERS_FETCHING_ERROR':
						return {
							...state,
							filtersLoadingStatus: 'error'
						}
						case 'ACTIVE_FILTER_CHANGE':
							return {
								...state,
								activeFilter: action.payload,
							}
        default: return state
    }
}

export default reducer;