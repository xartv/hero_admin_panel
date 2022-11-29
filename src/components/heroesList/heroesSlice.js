import { useHttp } from '../../hooks/http.hook';
import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from '@reduxjs/toolkit';

const heroesAdapter = createEntityAdapter(); // создаем адаптер

const initialState = heroesAdapter.getInitialState({ // Вытягиваем из него инишлСтэйт и используем его в создании слайса. В аргументы передаем объект с дополнительными полями для добавления в инишлСтэйт. initialState сейчас содержит объект, с двумя полями entities и id. В первый помещаются наши герои в формате id: {hero} и с которыми нужно будет упрощенно взаимодействовать (удалять, добавлять, менять), а во втором будут содержаться айдишки этих героев. Отдельно добавляем статусы, потому что для них нет необходимости вводить такой фунеционал, как для героев, они являются вспомогательными стэйтами
	heroesLoadingStatus: 'idle',
	heroesDeletingStatus: 'idle'
});

const { selectAll } = heroesAdapter.getSelectors(state => state.heroes) // создаем глобализированные селекторы, привязанные к срезу heroes. Таким образом мы получаем селектор для использования в любой части приложения, который будет возвращать массив объектов из среза heroes

export const filteredHeroesSelector = createSelector(
	(state) => state.filters.activeFilter,    // собираем по кусочкам значения из стэйто
	selectAll, // передаем наш селектор из адаптера для получения героев из среза. По сути у нее функционал схож с функцией выше, она также получает стэйт и также возвращает нужный нам кусок из этого стэйта, только делает это внутри адаптера
	(filter, heroes) => { // используем собранные значения в итоговой функции
		if (filter === 'all') {
			return heroes;
		} else {
			return heroes.filter(hero => hero.element === filter)
		}
	}  
)

export const fetchHeroes = createAsyncThunk( // создаем асинхронный экшнкриэйтор, который на самом деле возвращает сразу три экшнкриэйтора, которые называются pending, fulfilled, rejected
	'heroes/fetchHeroes', // первый аргумент имя среза/действие в формате строки 
	() => { // второй аргумент, асинхронная функция, которая должна вернуть промис. Сама функция принимает в себя два аргумента, первый - это то, что приходит после диспатча (например, где-то в коде при вызове этого экшнкриэйтора мы передаем в него айдишку, чтобы по этой айдишке найти персонажа, так вот, эта айдишка и придет сюда первым аргументом), второй - это API самого thunk, через который можно получать доступ к диспэтчу, к гетСтэйту и т.д
		const {request} = useHttp(); 
		return request("http://localhost:3001/heroes") // возвращаем промис, как результат выполнения функции. Не пишем async/await потому что внутри request это реализовано. Причем данные полученные из промиса (из запроса в данном случае) перейдут в action.payload и ниже по коду мы их используем в обработке промиса fulfilled
	}
)

const heroesSlice = createSlice({
	name: 'heroes',
	initialState,
	reducers: {
		heroAdd: (state, action) => {
			heroesAdapter.addOne(state, action.payload) // добавляем сущность с помощью апишки адаптера
		},
		heroDeleting: state => {
			state.heroesDeletingStatus = 'deleting';
		},
		heroDeleted: (state, action) => {
			state.heroesDeletingStatus = 'idle';
			heroesAdapter.removeOne(state, action.payload)
		},
		heroDeletingError: state => {
			state.heroesDeletingStatus = 'error';
		},
	},
	extraReducers: (builder) => { // используем поле extraReducers чтобы добавить кастомные кэйсы в основной слайс
		builder
			.addCase(fetchHeroes.pending, state => {state.heroesLoadingStatus = 'loading'}) // обрабатываем экшнкриэйтор из createAsyncThunk, он отвечает за начальный этап фетчинга, когда данные только отправляются
			.addCase(fetchHeroes.fulfilled, (state, action) => { // второй экшнкриэйтор - это успешное завершение промиса
				state.heroesLoadingStatus = 'idle';
				heroesAdapter.setAll(state, action.payload); // используя entity adapter API назначаем наши данные, первый аргумет - это стэйт, в который данные задаются, второй - это непосредственно данные, которые нужно внести в стэйт. setAll затирает все предыдущие данные и заменяет их новыми, если бы нужно было сохранить предыдущие данные, то пользоваться нужно было бы методом setMany()
			})
			.addCase(fetchHeroes.rejected, state => {
				state.heroesLoadingStatus = 'error';
			})
			.addDefaultCase(() => {});
	} 
});

const {actions, reducer} = heroesSlice;

export default reducer;

export const {
	heroesFetching,
	heroesFetched,
	heroesFetchingError,
	heroAdd,
	heroDeleting,
	heroDeleted,
	heroDeletingError,
} = actions