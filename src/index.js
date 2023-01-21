import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import {setContext} from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'https://react-todo-jdb.hasura.app/v1/graphql'
})

const authLink = setContext((_, { headers }) => {
  const token = '8D1Th4jDKY7m4erOSEzl41vvG4wEZ8mJMao9lCt40evLUEu7gQC30wVp2n81DMth';
  return {
    headers: {
      ...headers,
      "x-hasura-admin-secret": token
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
