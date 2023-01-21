import React from "react";
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_TODOS = gql`
  query getTodos {
    todos {
      id
      text
      done
    }
  }
`;

const TOGGLE_TODO = gql`
  mutation toggleTodo($id: uuid!, $done: Boolean!) {
    update_todos(where: {id: {_eq: $id}}, _set: {done: $done}) {
      returning {
        done
        id
        text
      }
    }
  }
`;

const ADD_TODO = gql`
  mutation addTodo($text: String!) {
    insert_todos(objects: {text: $text}) {
      returning {
        done
        id
        text
      }
    }
  }
`;

function App() {
  const { data, loading, error } = useQuery(GET_TODOS);
  const [toggleTodo] = useMutation(TOGGLE_TODO);
  const [addTodo] = useMutation(ADD_TODO);

  function handleToggleTodo({ id, done }) {
    toggleTodo({ variables: { id, done: !done } })
  }

  if (loading) return <div>Loading todos...</div>
  if (error) return <div>Error fetching todos</div>
  
  return (
    <div className="vh-100 code flex flex-column items-center bg-purple white
                    pa3 fl-1">
      <h1 className="f2-l">
      GraphQL Todo List
      <span role="img" aria-label="Checkmark"> ✅</span>
      </h1>
      <form className="mb3">
        <input
          className="pa2 f4"
          type="text"
          placeholder="Enter a todo"
        />
        <button className="pa2 f4 bg-green" type="submit">Create</button>
      </form>
      <div className="flex items-center justify-center flex-column">
        {data.todos.map(todo => (
          <p onDoubleClick={() => handleToggleTodo(todo)} key={todo.id}>
            <span className={`pointer list pa3 f3 ${todo.done && 'strike'}`}>{todo.text}</span>
            <button className="bg-transparent bn f4">
              <span className="red">&times;</span>
            </button>
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;
