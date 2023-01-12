import { useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { object, string } from "yup";
import { v4 as uuidv4 } from "uuid";

import { selectAll } from "../heroesFilters/filtersSlice";
import { useCreateHeroMutation } from "../../api/apiSlice";

const HeroesAddForm = () => {
  const filters = useSelector(selectAll);
  const [createHero] = useCreateHeroMutation();

  const onSubmit = ({ name, description, element }) => {
    const newHero = {
      id: uuidv4(),
      name,
      description,
      element,
    };

    createHero(newHero).unwrap();
  };

  const createOptions = optionsList => {
    return optionsList
      .filter(option => option.name !== "all")
      .map(option => {
        return (
          <option key={uuidv4()} value={option.name}>
            {option.title}
          </option>
        );
      });
  };

  const optionElements = createOptions(filters);
  const filtersName = filters.map(item => item.name);

  return (
    <Formik
      initialValues={{
        name: "",
        description: "",
        element: "",
      }}
      validationSchema={object({
        name: string()
          .min(2, "Need 2 or more symbols")
          .required("Name is required"),
        description: string().min(5, "Need 5 or more symbols"),
        element: string()
          .oneOf(filtersName, "Please select one of listed elements")
          .required(),
      })}
      onSubmit={(values, actions) => {
        onSubmit(values);
        actions.resetForm();
      }}
    >
      <Form className="border p-4 shadow-lg rounded">
        <div className="mb-3">
          <label htmlFor="name" className="form-label fs-4">
            Имя нового героя
          </label>
          <Field
            name="name"
            className="form-control"
            id="name"
            placeholder="Как меня зовут?"
          />
          <ErrorMessage
            name="name"
            render={msg => <div className="error">{msg}</div>}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="text" className="form-label fs-4">
            Описание
          </label>
          <Field
            name="description"
            className="form-control"
            id="description"
            placeholder="Что я умею?"
            style={{ height: "130px" }}
            as="textarea"
          />
          <ErrorMessage
            name="description"
            render={msg => <div className="error">{msg}</div>}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="element" className="form-label">
            Выбрать элемент героя
          </label>
          <Field
            className="form-select"
            id="element"
            name="element"
            as="select"
          >
            <option>Я владею элементом...</option>
            {optionElements}
          </Field>
          <ErrorMessage
            name="element"
            render={msg => <div className="error">{msg}</div>}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Создать
        </button>
      </Form>
    </Formik>
  );
};

export default HeroesAddForm;
