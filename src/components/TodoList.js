import React from 'react'
import Todo from './Todo'

const TodoList = ({ data, GET_TODOS }) => {
  return (
    <div className="flex items-center justify-center flex-column">
        {data.todos.map(todo => (
            <Todo todo={todo} GET_TODOS={GET_TODOS}/>
        ))}
    </div>

  )
}

export default TodoList