import PersonDetails from "./PersonDetails";

export default function Persons({ persons, handlePersonDeletion }) {
  return (
    <div>
      {persons.map((person) => (
        <PersonDetails
          key={person.name}
          name={person.name}
          number={person.number}
          id={person.id}
          handlePersonDeletion={handlePersonDeletion}
        />
      ))}
    </div>
  );
}
