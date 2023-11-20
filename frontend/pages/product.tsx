import React, { useState } from 'react';

const ProductPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8080/api/get-production-steps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product: inputValue }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setApiResponse(data);
    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Unbekannter Fehler!');
          }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-10">
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="flex flex-col">
                <label htmlFor="productInput" className="text-4xl font-semibold mb-8">
                    Welches Produkt wird in dem Werk produziert?
                </label>
                <input
                    type="text"
                    id="productInput"
                    name="productInput"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="bg-white border border-gray-200 text-gray-900 text-lg rounded-md focus:ring-2 focus:ring-ring-color focus:ring-offset-0 focus:border-ring-color focus:outline-none shadow-sm p-3 mb-2"
                    placeholder="Konkreten Produktnamen eingeben"
                    required
                />
                <div className="flex justify-end mb-2">
                <button
                    type="submit"
                    className="bg-blue-950 hover:bg-hover-color text-white font-bold py-2 px-4 rounded-md"
                    >
                    Bestätigen
                </button>
                </div>
            </div>
        </form>


        {isLoading && !apiResponse && (
        <div className="italic text-gray-500">Wizard verarbeitet die Anfrage...</div>
      )}

{apiResponse && (
  <div className="mt-4 p-4 border rounded-md shadow bg-white">
    <h2 className="font-semibold text-lg">Für dieses Produkt gibt es üblicherweise folgende Produktionsschritte:</h2>
    <ul className="list-none list-inside">
      {apiResponse.split('\n').map((step, index) => (
        <li key={index}>{step}</li>
      ))}
    </ul>
  </div>
      )}

      {error && <div className="text-red-500">Error: {error}</div>}
    </div>
  )
};

export default ProductPage;
