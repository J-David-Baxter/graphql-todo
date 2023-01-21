import { gql, useMutation } from '@apollo/client';
import React from 'react'

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

const Todo = ({ todo, GET_TODOS }) => {
    const [toggleTodo] = useMutation(TOGGLE_TODO);
    const [deleteTodo] = useMutation(DELETE_TODO);
    
    function handleToggleTodo({ id, done }) {
        toggleTodo({ variables: { id, done: !done } })
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
  
    return (
    <>
        <p onDoubleClick={() => handleToggleTodo(todo)} key={todo.id}>
            <span className={`pointer list pa3 f3 ${todo.done && 'strike'}`} style={{ userSelect: 'none' }}>{todo.text}</span>
            <button onClick={() => handleDeleteTodo(todo)} className="bg-transparent bn f4">
              <span className="red">&times;</span>
            </button>
        </p>
    </>
  )
}

export default Todo