import {useHttp} from '../../hooks/http.hook';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { heroesFetching, heroesFetched, heroesFetchingError, heroesDeleting, heroesDeleted, heroesDeletingError, filtersFetching, filtersFetched, filtersFetchingError } from '../../actions';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

import './heroesList.scss'

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {
    const {heroes, heroesLoadingStatus, activeFilter} = useSelector(state => state);
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

    const renderHeroesList = (arr, filter) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }

				let visibleData;

				if(!filter || filter === 'all') {
					visibleData = arr;
				} else {
					visibleData = arr.filter(item => item.element === filter)
				}

        return visibleData.map(({id, ...props}) => {
            return (
							<CSSTransition 
							timeout={300} 
							classNames="heroItem">
								<HeroesListItem key={id} onHeroDelete={() => onHeroDelete(id)} {...props}/>
							</CSSTransition>
							
						)
        })
    }
	
    const elements = renderHeroesList(heroes, activeFilter);
    return (
        <ul>
					<TransitionGroup>
						{elements}
					</TransitionGroup>
        </ul>
    )
}

export default HeroesList;