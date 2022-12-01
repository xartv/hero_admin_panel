import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { v4 as uuidv4 } from 'uuid';

import { useGetHeroesQuery, useDeleteHeroMutation } from '../../api/apiSlice';

import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

import './heroesList.scss'

const HeroesList = () => {

	const {
		data: heroes = [],
		isLoading,
		isError,
	} = useGetHeroesQuery();

	const [heroDelete] = useDeleteHeroMutation();

	const activeFilter = useSelector(state => state.filters.activeFilter);

	const filteredHeroes = useMemo(() => { // используем собранные значения в итоговой функции
		const filteredHeroes = heroes.slice()

		if (activeFilter === 'all') {
			return filteredHeroes;
		} else {
			return filteredHeroes.filter(hero => hero.element === activeFilter)
		}
	}, [heroes, activeFilter]) 

	const onHeroDelete = useCallback((id) => {
		heroDelete(id);
		// eslint-disable-next-line
	}, []);

	if (isLoading) {
			return <Spinner/>;
	} else if (isError) {
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
	const elements = renderHeroesList(filteredHeroes);
	return (
		//<ul> // в таком случае дочерний компонент с героем рендерится как положено, один раз
		//	{elements}
		//</ul>
		<TransitionGroup component='ul'> 
			{elements}
		</TransitionGroup>
	)
}

export default HeroesList;