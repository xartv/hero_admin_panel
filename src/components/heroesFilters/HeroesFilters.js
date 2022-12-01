import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { activeFilterChange, fetchFilters, selectAll } from './filtersSlice';
import { v4 as uuidv4 } from 'uuid';
import classNames from 'classnames';

import Spinner from '../spinner/Spinner';

const HeroesFilters = () => {
	const { activeFilter, filtersLoadingStatus } = useSelector(state => state.filters);
	const filters = useSelector(selectAll);
	//const filters = selectAll(store.getState()) // либо можно воспользоваться таким синтаксисом, когда мы напрямую вызываем селектор и передаем в него стэйт, получая его из глобального объекта store. По сути, то же самое происходит и выше, только там этот стор приходит автоматически с помощью useSelector.
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchFilters())
		// eslint-disable-next-line
	}, [])

	if (filtersLoadingStatus === "loading") {
		return <Spinner/>;
	} else if (filtersLoadingStatus === "error") {
		return <h5 className="text-center mt-5">Ошибка загрузки</h5>
	}

	const createFilterButtons = (filtersList) => {
		if (filtersList.length === 0) {
			return <h5 className="text-center mt-5">Фильтры не найдены</h5>
		}

		return filtersList
						.map(filter => {
							const className = classNames(filter.className, {
								active: filter.name === activeFilter
							})
							return (
									<button
										key={uuidv4()}
										id={filter.name}
										className={className}
										onClick={() => dispatch(activeFilterChange(filter.name))}
										>
											{filter.title}
										</button>
								)
							})
	}

	const filterElements = createFilterButtons(filters);

	return (
		<div className="card shadow-lg mt-4">
			<div className="card-body">
				<p className="card-text">Отфильтруйте героев по элементам</p>
				<div className="btn-group">
					{filterElements}
				</div>
			</div>
		</div>
	)
}

export default HeroesFilters;