import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { useDispatchNotification } from "./contexts/NotificationContext";
import anecdotesService from "./services/anecdotes";
import { useMutation, useQuery, useQueryClient } from "react-query";

const App = () => {
  const queryCLient = useQueryClient();
  const dispatchNotification = useDispatchNotification();
  const vote = useMutation({
    mutationFn: (anecdote) => anecdotesService.vote(anecdote),
    onSuccess(data) {
      dispatchNotification({
        type: "SET_NOTIFICATION",
        payload: `anecdote ${data.content} voted`,
      });
      queryCLient.setQueryData("anecdotes", (prevAnecdotes) => {
        return prevAnecdotes.map((anecdote) =>
          anecdote.id === data.id ? data : anecdote
        );
      });
    },
  });
  const handleVote = (anecdote) => {
    vote.mutate(anecdote);
  };

  const { data, isError } = useQuery("anecdotes", {
    queryFn: () => anecdotesService.getAll(),
  });

  if (isError) {
    return <p>anecdote service not available due to problems in server</p>;
  }
  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {data?.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
