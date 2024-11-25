import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/api')
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data from backend:', error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>React + Node.js + MySQL</h1>
        <p>Message from the server:</p>
        <p>{message}</p>
      </header>
    </div>
  );
}

export default App;
