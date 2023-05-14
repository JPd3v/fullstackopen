import { useMutation, useQueryClient } from "react-query";
import anecdoteService from "../services/anecdotes";
import { useDispatchNotification } from "../contexts/NotificationContext";

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const dispatchNotification = useDispatchNotification();
  const newAnecdote = useMutation({
    mutationFn: (content) => anecdoteService.newAnecdote(content),
    onSuccess(data) {
      dispatchNotification({
        type: "SET_NOTIFICATION",
        payload: `anecdote ${data.content} added `,
      });
      queryClient.setQueryData("anecdotes", (prevAnecdotes) => [...prevAnecdotes, data]);
    },
    onError(error) {
      dispatchNotification({
        type: "SET_NOTIFICATION",
        payload: error.response.data.error,
      });
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    console.log("new anecdote");
    newAnecdote.mutate(content);
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
