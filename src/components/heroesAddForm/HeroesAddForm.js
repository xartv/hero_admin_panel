import { Formik, Form, Field, ErrorMessage, } from 'formik';
import { object, string } from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {useHttp} from '../../hooks/http.hook';
import { heroAdd } from '../../actions';
import { v4 as uuidv4 } from 'uuid';

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {
	const dispatch = useDispatch();
	const {request} = useHttp();

	const onSubmit = ({name, description, element}) => {
		const newHero = {
			id: uuidv4(),
			name,
			description,
			element,
		}
		console.log(newHero);
		request('http://localhost:3001/heroes', 'POST', JSON.stringify(newHero))
			.then(() => dispatch(heroAdd(newHero)))
	}

	return (
		<Formik
			initialValues={{
				name: '',
				description: '',
				element: '',
			}}
			validationSchema={object({
				name: string()
									.min(2, 'Need 2 or more symbols')
									.required('Name is required'),
				description: string()
												.min(5, 'Need 5 or more symbols'),
				element: string()
								.required(),
			})}
			onSubmit={onSubmit}
		>
			<Form className="border p-4 shadow-lg rounded">
					<div className="mb-3">
							<label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
							<Field  
								name="name" 
								className="form-control" 
								id="name" 
								placeholder="Как меня зовут?"/>
							<ErrorMessage name="name" component='div'/>
					</div>

					<div className="mb-3">
							<label htmlFor="text" className="form-label fs-4">Описание</label>
							<Field
								name="description" 
								className="form-control" 
								id="description" 
								placeholder="Что я умею?"
								style={{"height": '130px'}}
								as="textarea"/>
							<ErrorMessage name="description" component='div'/>
					</div>

					<div className="mb-3">
							<label htmlFor="element" className="form-label">Выбрать элемент героя</label>
							<Field
								className="form-select" 
								id="element" 
								name="element"
								as="select">
									<option >Я владею элементом...</option>
									<option value="fire">Огонь</option>
									<option value="water">Вода</option>
									<option value="wind">Ветер</option>
									<option value="earth">Земля</option>
							</Field>
							<ErrorMessage name="element" component='div'/>
					</div>

					<button type="submit" className="btn btn-primary">Создать</button>
			</Form>
		</Formik>
		
)
}

export default HeroesAddForm;