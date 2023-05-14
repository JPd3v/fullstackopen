import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";

export default function AnecdoteForm() {
  const dispatch = useDispatch();

  async function handleSubmit(event) {
    event.preventDefault();
    const content = event.target.anecdote.value;

    dispatch(createAnecdote(content));
    event.target.anecdote.value = "";
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>create new</h2>
      <div>
        <input name="anecdote" />
      </div>
      <button>create</button>
    </form>
  );
}
