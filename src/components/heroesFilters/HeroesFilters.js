import { useDispatch, useSelector } from 'react-redux';
import { activeFilterChange } from '../../actions';
import { v4 as uuidv4 } from 'uuid';
// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

const HeroesFilters = () => {
	const { filters, activeFilter } = useSelector(state => state);
	const dispatch = useDispatch();
	
	const onChangeActiveFilter = (filter) => {
		dispatch(activeFilterChange(filter));
	}

	const createFilterButtons = (filtersList) => {
		return filtersList
						.map(filter => {
							return (
									<button
										key={uuidv4()} 
										className={(filter.name === activeFilter) ? `${filter.className} active` : filter.className}
										onClick={() => onChangeActiveFilter(filter.name)}
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