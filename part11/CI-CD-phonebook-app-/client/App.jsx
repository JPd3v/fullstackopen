import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personsService from "./services/persons";
import Notification from "./components/Notification";
import "./App.css";

function compareObjectsNames(firstObj, secondObj) {
  const firstObjName = firstObj.name;
  const secondObjName = secondObj.name;
  if (firstObjName === secondObjName) return true;
  return false;
}

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const content = nameFilter
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(nameFilter.toLowerCase().trim())
      )
    : persons;

  useEffect(() => {
    personsService.getAll().then((response) => setPersons(response));
  }, []);

  function handleNameInput(event) {
    setNewName(event.target.value);
  }

  function handleNumberInput(event) {
    setNewNumber(event.target.value);
  }

  function handleNameFilterInput(event) {
    setNameFilter(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();

    function successNotification() {
      setSuccessMessage(`Added ${newPerson.name}`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    }

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    const foundPerson = persons.find(
      (person) => person.name === newPerson.name
    );
    let personAlreadyExists = undefined;
    foundPerson
      ? (personAlreadyExists = compareObjectsNames(foundPerson, newPerson))
      : null;

    if (personAlreadyExists) {
      if (
        window.confirm(
          `${newPerson.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        setNewName("");
        setNewNumber("");
        personsService
          .update(foundPerson.id, newPerson)
          .then((response) => {
            setPersons((prev) =>
              [...prev].map((person) =>
                person.name === response.name ? response : person
              )
            );
            successNotification();
          })
          .catch((error) => {
            console.log(error.response.data.error);
            setErrorMessage(error.response.data.error);
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          });
      }
      return;
    }

    setNewName("");
    setNewNumber("");
    personsService
      .create(newPerson)
      .then((response) => {
        setPersons((prev) => [...prev, response]);
        successNotification();
      })
      .catch((error) => {
        console.log(error.response.data.error);
        setErrorMessage(error.response.data.error);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  }

  function handlePersonDeletion(id, name) {
    if (window.confirm(`Delete ${name}`)) {
      personsService
        .deletePerson(id)
        .then(() =>
          setPersons((prev) => prev.filter((person) => person.id !== id))
        )
        .catch(() => {
          setErrorMessage(
            `information of ${name} has already been removed from the server`
          );
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
          setPersons(persons.filter((person) => person.id !== id));
        });
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} type={"success"} />
      <Notification message={errorMessage} type={"error"} />
      <Filter value={nameFilter} handleChange={handleNameFilterInput} />
      <h2>add a new</h2>
      <PersonForm
        handleSubmit={handleSubmit}
        name={newName}
        handleNameChange={handleNameInput}
        number={newNumber}
        handleNumberChange={handleNumberInput}
      />
      <h2>Numbers</h2>
      <Persons persons={content} handlePersonDeletion={handlePersonDeletion} />
    </div>
  );
};

export default App;
