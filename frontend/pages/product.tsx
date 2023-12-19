import React, { useState } from 'react';
import { Spinner } from '@chakra-ui/react'
import StepperComponent from '../components/StepperComponent';
import { Button, Box, Progress } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import LoaderComponent from '../components/LoaderComponent';
import { toggleArrayValue } from '../utils/utils';


const ProductPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [clickedSteps, setClickedSteps] = useState<number[]>([]);
  const [additionalStep, setAdditionalStep] = useState('');
  const activeStepIndex = 1;
  const router = useRouter();
  const [error, setError] = useState('');


  const handleButtonClick = (index) => {
    setClickedSteps((prev) => toggleArrayValue(prev, index));
  };

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

  const handleAdditionalStepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdditionalStep(e.target.value);
  };

  const handleConfirmClick = () => {
    if (apiResponse) {
      // Get the text of the clicked steps
      const selectedSteps = clickedSteps.map((index) => {
          const stepText = apiResponse.split('\n')[index];
          return stepText.replace(/^\d+\.\s*/, '').trim();
      });

      // Add the additional step if it's not empty
      if (additionalStep.trim() !== '') {
          selectedSteps.push(additionalStep.trim());
      }

      // Navigate to the /roles page with the combined steps
      router.push({
          pathname: '/roles',
          query: {
              product: inputValue,
              clickedSteps: JSON.stringify(selectedSteps),
          },
      });
  } else {
      console.error('apiResponse is null');
  }
};


  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-10">
      
        <div className="pb-20 width: '100%'">
            <StepperComponent activeIndex={activeStepIndex} />
        </div>        

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
                {!apiResponse && (
                  <div className="flex justify-end mb-2">
                  <button
                      type="submit"
                      className="bg-blue-950 hover:bg-hover-color text-white font-bold py-2 px-4 rounded-md"
                      >
                      Bestätigen
                  </button>
                  </div>
                )}
            </div>
        </form>

        {isLoading && !apiResponse && (
            <LoaderComponent />
        )}

        {apiResponse && (
        <Box className="answer-box">
            <h2 className="h2-answer-box">Für dieses Produkt gibt es üblicherweise folgende Produktionsschritte:<br/><br/><i>Bitte klicke alle Schritte an, die auf dein Werk zutreffen.</i></h2>
            <div className="grid-answer-box">
            {apiResponse.split('\n').map((step, index: number) => (
                <Button
                key={index}
                onClick={() => handleButtonClick(index)}
                sx={{
                  backgroundColor: clickedSteps.includes(index) ? '#0c4a6e' : '',
                  color: clickedSteps.includes(index) ? 'white' : 'black',
                }}
              >
                {step}
              </Button>
            ))}
            </div>

            <div className="mt-10">
              <label htmlFor="additionalStep" className="text-xl font-semibold">
                Weitere Produktionsschritte (optional):
              </label><br></br>
              <input
                type="text"
                id="additionalStep"
                name="additionalStep"
                value={additionalStep}
                onChange={handleAdditionalStepChange}
                className="free-text-field mt-4 w-full resize-y"
                placeholder="Weitere Schritte hinzufügen"
              />
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleConfirmClick}
                    className="bg-blue-950 hover:bg-hover-color text-white font-bold py-2 px-4 rounded-md mt-4">
                    Bestätigen
                </button>
            </div>
            
        </Box>
        )}

        {error && <div className="text-red-500">Error: {error}</div>}
    </div>
    )
  };

export default ProductPage;
