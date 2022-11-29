import { useHttp } from '../../hooks/http.hook';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
	heroes: [],
	heroesLoadingStatus: 'idle',
	heroesDeletingStatus: 'idle',
}

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
			state.heroes.push(action.payload);
		},
		heroDeleting: state => {
			state.heroesDeletingStatus = 'deleting';
		},
		heroDeleted: (state, action) => {
			state.heroesDeletingStatus = 'idle';
			state.heroes = state.heroes.filter(hero => hero.id !== action.payload);
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
				state.heroes = action.payload; 
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