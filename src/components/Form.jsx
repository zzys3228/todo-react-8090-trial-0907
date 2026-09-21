import { useState } from "react";
import TitleCounter from "./TitleCounter";
import { limitTitle, MAX_TITLE_LENGTH } from "../constants/titleLimit";

function Form(props) {
  const [name, setName] = useState('');

  // NOTE: As written, this function has a bug: it doesn't prevent the user
  // from submitting an empty form. This is left as an exercise for developers
  // working through MDN's React tutorial.
  function handleSubmit(event) {
    event.preventDefault();
    props.addTask(name);
    setName("");
  }

  function handleChange(event) {
    setName(limitTitle(event.target.value));
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="label-wrapper">
        <label htmlFor="new-todo-input" className="label__lg">
          What needs to be done?
        </label>
      </h2>

      <input
        type="text"
        id="new-todo-input"
        className="input input__lg"
        name="text"
        autoComplete="off"
        value={name}
        maxLength={MAX_TITLE_LENGTH}
        aria-describedby="new-todo-input-counter"
        onChange={handleChange}
      />
      <TitleCounter value={name} fieldId="new-todo-input" />
      <button type="submit" className="btn btn__primary btn__lg">
        Add
      </button>
    </form>
  );
}

export default Form;
