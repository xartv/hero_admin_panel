import { configureStore } from '@reduxjs/toolkit';

import filters from '../components/heroesFilters/filtersSlice';
import { apiSlice } from '../api/apiSlice';

const stringMiddleware = ({dispatch, getState}) => (next) => (action) => { // получаем диспэтч и гетСтэйт из стора в качестве первого аргумента, затем возвращаем функцию, в которую приходит первым аргументом диспэтч, которая в свою очередь получает первым аргументом экшн, которая уже возвращает новый экшн используя логику внутри
	if (typeof action === 'string') {
		return next({
			type: action
		})
	}
	return next(action);
} 

const store = configureStore({ // создаем стор с помощью тулкита
	reducer: {filters, 
						[apiSlice.reducerPath]: apiSlice.reducer}, // аналог combine reducers
	middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware, apiSlice.middleware),
	devTools: process.env.NODE_ENV !== 'production', // указываем, что включать девтулз нужно только в том случае, если мы находимся не в продакшн билде
	
})

export default store;