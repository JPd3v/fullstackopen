import { useSelector, useDispatch } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";

export default function AnecdoteList() {
  const anecdotes = useSelector(({ anecdotes, filter }) =>
    anecdotes
      .filter((anecdote) => anecdote.content.includes(filter))
      .sort((a, b) => b.votes - a.votes)
  );

  const dispatch = useDispatch();

  function vote(anecdote) {
    dispatch(voteAnecdote(anecdote, 5));
  }

  return anecdotes.map((anecdote) => (
    <div key={anecdote.id}>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={() => vote(anecdote)}>vote</button>
      </div>
    </div>
  ));
}
