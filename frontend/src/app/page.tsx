'use client'
import { useState } from 'react'

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState('')
  const [loading, setLoading] = useState(false)

  const createIndexAndEmbeddings = async () => {
    try {
      const result = await fetch('http://localhost:5000/setup', {
        method: 'POST',
        headers: {
          'Origin': 'http://localhost:3000',
        }
      });
      const json = await result.json();
      console.log('result: ', json);
    } catch (error) {
      console.error('error: ', error);
    }
  };

  const sendQuery = async () => {
    if (!query) return;

    setResults('');
    setLoading(true);

    try {
      const result = await fetch('http://localhost:5000/query_pinecone', {
        method: 'POST',
        body: JSON.stringify({ question: query }),  // Wrap the query in an object
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:3000'
        }
      });

      if (!result.ok) {
        throw new Error(`HTTP error! Status: ${result.status}`);
      }

      const json = await result.json();

      setResults(json);
      setLoading(false);
    } catch (error) {
      console.error('error: ', error);
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <input
        className="text-black px-2 py-1"
        onChange={e => setQuery(e.target.value)}
      />
      <button className="px-7 py-1 rounded-2xl bg-white text-black mt-2 mb-2" onClick={sendQuery}>
        Ask AI
      </button>
      {
        loading && <p>Asking AI...</p>
      }
      {
        results && <p>{results}</p>
      }
      <button onClick={createIndexAndEmbeddings}>Create Index and Embeddings</button>
    </main>
  )
}