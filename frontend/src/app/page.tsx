'use client'
import {
  useState
} from 'react'

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState('')
  const [loading, setLoading] = useState(false)

  async function createIndexAndEmbeddings() {
    try {
      const result = await fetch("../../api/setup", {
        method: "POST"
      })
      const json = await result.json()
      console.log("result: ", json)
    } catch (error) {
      console.error("error: ", error)
    }
  }

  async function sendQuery() {
    if (!query) return

    setResults('')
    setLoading(true)

    // try {
    //   const result = await fetch("/api/read", {
    //     method: "POST",
    //     body: JSON.stringify(query)
    // })

    try {
      const result = await fetch("/api/read", {
          method: "POST",
          body: JSON.stringify(query),
          headers: {
              "Content-Type": "application/json"
          }
      });

      if (!result.ok) {
          throw new Error(`HTTP error! Status: ${result.status}`);
      }

    const json = await result.json()

    setResults(json)
    setLoading(false)
    } catch (error) {
      console.error("error: ", error)
      setLoading(false)
    }
  }

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