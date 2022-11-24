import {useHttp} from '../../hooks/http.hook';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { activeFilterChange, filtersFetching, filtersFetched, filtersFetchingError } from '../../actions';
import { v4 as uuidv4 } from 'uuid';
import classNames from 'classnames';

import Spinner from '../spinner/Spinner';

const HeroesFilters = () => {
	const { filters, activeFilter, filtersLoadingStatus } = useSelector(state => state.filters);
	const dispatch = useDispatch();
	const {request} = useHttp();

	useEffect(() => {
		filtersListRequest();
		// eslint-disable-next-line
	}, [])

	if (filtersLoadingStatus === "loading") {
		return <Spinner/>;
	} else if (filtersLoadingStatus === "error") {
		return <h5 className="text-center mt-5">Ошибка загрузки</h5>
	}

	const filtersListRequest = () => {
		dispatch(filtersFetching());
			request("http://localhost:3001/filters")
					.then(data => dispatch(filtersFetched(data)))
					.catch(() => dispatch(filtersFetchingError()));
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