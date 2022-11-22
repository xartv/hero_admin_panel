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

export const heroesDeleting = () => {
	return {
			type: 'HEROES_DELETING'
	}
}

export const heroesDeleted = (heroes, index) => {
	return {
		type: 'HEROES_DELETED',
	}
}

export const heroesDeletingError = () => {
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