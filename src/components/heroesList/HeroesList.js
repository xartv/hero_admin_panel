import {useHttp} from '../../hooks/http.hook';
import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { v4 as uuidv4 } from 'uuid';
import { createSelector } from 'reselect'

import { heroesFetching, heroesFetched, heroesFetchingError, heroDeleting, heroDeleted, heroDeletingError } from '../../actions';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

import './heroesList.scss'

const HeroesList = () => {
	
	const filteredHeroesSelector = createSelector(
		(state) => state.filters.activeFilter,    // собираем по кусочкам значения из стэйто
		(state) => state.heroes.heroes,
		(filter, heroes) => { // используем собранные значения в итоговой функции
			if (filter === 'all') {
				console.log('render')
				return heroes;
			} else {
				return heroes.filter(hero => hero.element === filter)
			}
		}  
	)

		const filteredHeroes = useSelector(filteredHeroesSelector) // используем наш кастомный селектор в качестве коллбэка для useSelector

	//const filteredHeroes = useSelector(state => { // не оптимизированный функционал, вызывает перерендеры, т.к. возвращаемый объект сравнивается по ссылке
	//	if (state.filters.activeFilter === 'all') {
	//		console.log('render')
	//		return state.heroes.heroes;
	//	} else {
	//		return state.heroes.heroes.filter(hero => hero.element === state.filters.activeFilter)
	//	}
	//})
	
	const heroesLoadingStatus = useSelector(state => state.heroesLoadingStatus);
	const dispatch = useDispatch();
	const {request} = useHttp();
	const nodeRef = useRef(null);

	useEffect(() => {
		heroesListRequest();
		// eslint-disable-next-line
	}, []);

	const onHeroDelete = useCallback((id) => {
		dispatch(heroDeleting());
		request(`http://localhost:3001/heroes/${id}`, 'DELETE')
			.then(() => {
				dispatch(heroDeleted(id));
			})
			.catch(() => dispatch(heroDeletingError()));
			// eslint-disable-next-line
	}, [request]);

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

	const renderHeroesList = (arr) => {
		if (arr.length === 0) {
				return (
					<CSSTransition
						key={uuidv4()}
						nodeRef={nodeRef}
						timeout={0} 
						classNames="heroItem">
							<h5 className="text-center mt-5">Героев пока нет</h5>
					</CSSTransition>
				)
		}

		return arr.map(({id, ...props}) => {
				return (
					<CSSTransition
					key={id}
					nodeRef={nodeRef}
					timeout={300} 
					classNames="heroItem">
						<HeroesListItem onHeroDelete={() => onHeroDelete(id)} {...props}/>
					</CSSTransition>
					
				)
		})
}

	const elements = renderHeroesList(filteredHeroes);
	return (
				<TransitionGroup component='ul'>
					{elements}
				</TransitionGroup>
	)
}

export default HeroesList;