import logo from './logo.svg';
import React, { useEffect } from 'react';
import io from 'socket.io-client';

import './App.css';

function App() {
  useEffect(() => {
    const socket = io('http://localhost:3000');
    // Add socket event listeners and emit events as required.
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
