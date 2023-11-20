'use client'
import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    fetch('http://127.0.0.1:8080/api/home')
      .then(response => response.json())
      .then(data => setMessage(data.message));
  }, []);

  return <div>{message}</div>;

}

export default App;