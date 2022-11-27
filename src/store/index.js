import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import heroes from '../reducers/heroes';
import filters from '../reducers/filters';

const stringMiddleware = ({dispatch, getState}) => (next) => (action) => { // получаем диспэтч и гетСтэйт из стора в качестве первого аргумента, затем возвращаем функцию, в которую приходит первым аргументом диспэтч, которая в свою очередь получает первым аргументом экшн, которая уже возвращает новый экшн используя логику внутри
	if (typeof action === 'string') {
		return next({
			type: action
		})
	}
	return next(action);
}

//const enhancer = (createStore) => (...args) => {
//	const store = createStore(...args);

//	const oldDispatch = store.dispatch; // сохраняем старый диспетч
//	store.dispatch = (action) => { // меняем логику диспэтча, когда приходит строка, то эту строку мы используем в качестве type для оригинального диспэтча
//		if (typeof action === 'string') {
//			return oldDispatch({
//				type: action
//			})
//		}
//		return oldDispatch(action);
//	}
//	return store; 
//}

//const store = createStore(
//									combineReducers({heroes, filters}), 
//									compose(
//										enhancer, 
//										window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())); // используем compose в качестве второго аргумента, эта функция объединяет несколько энхенсеров, нужно только учитывать порядок энхэнсеров, чтобы не было ошибок

const store = createStore( // используем middleware с помощью applyMiddleware для формирования стора
	combineReducers({heroes, filters}),
	compose(
		applyMiddleware(stringMiddleware), 
		window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
) 

export default store;