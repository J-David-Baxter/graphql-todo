import React, { useState } from "react";
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

const DELETE_TODO = gql`
  mutation deleteTodo($id: uuid!) {
    delete_todos(where: {id: {_eq: $id}}) {
      returning {
        done
        id
        text
      }
    }
  }
`

function App() {
  const [todoText, setTodoText] = useState('');
  
  const { data, loading, error } = useQuery(GET_TODOS);
  const [toggleTodo] = useMutation(TOGGLE_TODO);
  const [addTodo] = useMutation(ADD_TODO, {
    onCompleted: () => setTodoText('')
  });
  const [deleteTodo] = useMutation(DELETE_TODO);

  function handleToggleTodo({ id, done }) {
    toggleTodo({ variables: { id, done: !done } })
  }

  function handleAddTodo(e) {
    e.preventDefault();
    if(!todoText.trim()) return;
    addTodo({ variables: { text: todoText },
              refetchQueries: [
                { query: GET_TODOS }
              ]})
  }

  function handleDeleteTodo({ id }) {
    const isConfirmed = window.confirm('Do you want to delete this todo?');
    if (isConfirmed) {
      deleteTodo({ variables: { id },
        refetchQueries: [
         { query: GET_TODOS }
        ]})
    }
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
      <form className="mb3" onSubmit={handleAddTodo}>
        <input
          className="pa2 f4"
          type="text"
          placeholder="Enter a todo"
          onChange={e => setTodoText(e.target.value)}
          value={todoText}
        />
        <button className="pa2 f4 bg-green" type="submit">Create</button>
      </form>
      <div className="flex items-center justify-center flex-column">
        {data.todos.map(todo => (
          <p onDoubleClick={() => handleToggleTodo(todo)} key={todo.id}>
            <span className={`pointer list pa3 f3 ${todo.done && 'strike'}`} style={{ userSelect: 'none' }}>{todo.text}</span>
            <button onClick={() => handleDeleteTodo(todo)} className="bg-transparent bn f4">
              <span className="red">&times;</span>
            </button>
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;
