import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react'

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

const CreateTodo = ({ GET_TODOS }) => {
    const [todoText, setTodoText] = useState('');
    const [addTodo] = useMutation(ADD_TODO, {
        onCompleted: () => setTodoText('')
      });
    
    function handleAddTodo(e) {
        e.preventDefault();
        if(!todoText.trim()) return;
        addTodo({ variables: { text: todoText },
                  refetchQueries: [
                    { query: GET_TODOS }
                  ]})
      }
  
    return (
    <>
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
    </>
  )
}

export default CreateTodo