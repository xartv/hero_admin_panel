import {useHttp} from '../../hooks/http.hook';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { v4 as uuidv4 } from 'uuid';
import { createSelector } from 'reselect'

import { heroDeleting, heroDeleted, heroDeletingError, fetchHeroes, selectAll } from './heroesSlice';

import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

import './heroesList.scss'

//const MemoedHeroesListItem = memo(HeroesListItem); // можно мемоизировать дочерний компонент, снизим кол-во рендеров при диспатчах

const HeroesList = () => {

	const filteredHeroesSelector = createSelector(
		(state) => state.filters.activeFilter,    // собираем по кусочкам значения из стэйто
		(state) => state.heroes.heroes,
		(filter, heroes) => { // используем собранные значения в итоговой функции
			if (filter === 'all') {
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
	
	const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus);
	const dispatch = useDispatch();
	const {request} = useHttp();

	useEffect(() => {
		dispatch(fetchHeroes());
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

	const renderHeroesList = (arr) => {
		if (arr.length === 0) {
				return (
					<CSSTransition
						key={uuidv4()}
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
					timeout={1000} 
					classNames="heroItem">
						<HeroesListItem onHeroDelete={() => onHeroDelete(id)} {...props}/>
					</CSSTransition>
				)
		})
	}

	// из за библиотеки react-transition-group дочерний комопнент рендерится 4 раза, т.к. библиотека использует четыре разных css класса для отображения анимации на разных этапах, т.е. процесс рендера поделен на четыре этапа и на каждый этап приходится свой CSS класс, который и производит перерендер, т.к. поступает в пропсы
	//const elements = renderHeroesList(filteredHeroes);
	return (
		//<ul> // в таком случае дочерний компонент с героем рендерится как положено, один раз
		//	{elements}
		//</ul>
		<TransitionGroup component='ul'> 
			{/*{elements}*/}
		</TransitionGroup>
	)
}

export default HeroesList;