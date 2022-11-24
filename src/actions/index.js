export const heroesFetching = () => {
    return {
        type: 'HEROES_FETCHING'
    }
}

export const heroesFetched = (heroes) => {
    return {
        type: 'HEROES_FETCHED',
        payload: heroes
    }
}

export const heroesFetchingError = () => {
    return {
        type: 'HEROES_FETCHING_ERROR'
    }
}

export const heroDeleting = () => {
	return {
			type: 'HEROES_DELETING'
	}
}

export const heroDeleted = (id) => {
	return {
		type: 'HEROES_DELETED',
		payload: id,
	}
}

export const heroDeletingError = () => {
	return {
		type: 'HEROES_DELETING_ERROR',
	}
}

export const heroAdd = (hero) => {
	return {
		type: 'HERO_ADD',
		payload: hero,
	}
}

export const filtersFetching = () => {
	return {
		type: 'FILTERS_FETCHING',
	}
}

export const filtersFetched = (filters) => {
	return {
		type: 'FILTERS_FETCHED',
		payload: filters,
	}
}

export const filtersFetchingError = () => {
	return {
		type: 'FILTERS_FETCHING_ERROR',
	}
}

export const activeFilterChange = (filter) => {
	return {
		type: 'ACTIVE_FILTER_CHANGE',
		payload: filter,
	}
}