export default function PersonDetails({
  name,
  number,
  id,
  handlePersonDeletion,
}) {
  return (
    <div>
      <p>
        {name} {number}
      </p>
      <button onClick={() => handlePersonDeletion(id, name)}>Delete</button>
    </div>
  );
}
