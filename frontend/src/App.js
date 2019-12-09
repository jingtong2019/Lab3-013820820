import React from 'react';
import './App.css';
import './components/Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from './components/Main'
import {BrowserRouter} from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

// apollo client setup
const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql'
});

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
          <div className="App">
          <Main/>
          </div>
      </BrowserRouter>
    </ApolloProvider>
    
  );
}

export default App;
