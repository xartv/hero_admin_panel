import {useHttp} from '../../hooks/http.hook';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { heroesFetching, heroesFetched, heroesFetchingError, heroesDeleting, heroesDeleted, heroesDeletingError, filtersFetching, filtersFetched, filtersFetchingError } from '../../actions';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {
    const {heroes, heroesLoadingStatus} = useSelector(state => state);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
			heroesListRequest();
			filtersListRequest();
			// eslint-disable-next-line
    }, []);

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

		const heroesListRequest = () => {
			dispatch(heroesFetching());
        request("http://localhost:3001/heroes")
            .then(data => dispatch(heroesFetched(data)))
            .catch(() => dispatch(heroesFetchingError()));
		}

		const filtersListRequest = () => {
			dispatch(filtersFetching());
        request("http://localhost:3001/filters")
            .then(data => dispatch(filtersFetched(data)))
            .catch(() => dispatch(filtersFetchingError()));
		}

		const heroDeleteFromState = (id, heroes) => {
			return heroes.filter(hero => hero.id !== id);
		}

		const onHeroDelete = (id) => {
			dispatch(heroesDeleting());
			request(`http://localhost:3001/heroes/${id}`, 'DELETE')
				.then(() => {
					dispatch(heroesDeleted(heroDeleteFromState(id, heroes)));
				})
				.catch(() => dispatch(heroesDeletingError()));
		}

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }

        return arr.map(({id, ...props}) => {
            return <HeroesListItem key={id} onHeroDelete={() => onHeroDelete(id)} {...props}/>
        })
    }
	
    const elements = renderHeroesList(heroes);
    return (
        <ul>
            {elements}
        </ul>
    )
}

export default HeroesList;