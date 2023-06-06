export default function PersonForm({
  handleSubmit,
  name,
  handleNameChange,
  number,
  handleNumberChange,
}) {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div>
          name: <input value={name} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={number} onChange={handleNumberChange} />
        </div>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
}
