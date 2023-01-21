import React from "react";
import { useQuery, gql } from '@apollo/client';
import Header from "./components/Header";
import CreateTodo from "./components/CreateTodo";
import TodoList from "./components/TodoList";

const GET_TODOS = gql`
  query getTodos {
    todos {
      id
      text
      done
    }
  }
`;

function App() {
  const { data, loading, error } = useQuery(GET_TODOS);
  
  if (loading) return <div>Loading todos...</div>
  if (error) return <div>Error fetching todos</div>
  
  return (
    <div className="vh-100 code flex flex-column items-center bg-purple white pa3 fl-1">
      <Header />
      <CreateTodo GET_TODOS={GET_TODOS}/>
      <div className="flex items-center justify-center flex-column">
        <TodoList data={data} GET_TODOS={GET_TODOS}/>
      </div>
    </div>
  );
}

export default App;
