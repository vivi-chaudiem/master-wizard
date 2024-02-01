import React, { useState, useContext } from 'react';
import { Spinner } from '@chakra-ui/react'
import StepperComponent from '../components/StepperComponent';
import { Button, Box, Textarea, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import LoaderComponent from '../components/LoaderComponent';
import { toggleArrayValue } from '../utils/utils';
import { AdditionalContext } from 'context/additionalcontext';

const ProductPage = () => {
  const [productInput, setProductInput] = useState('');
  const { additionalCompanyInfo, setAdditionalCompanyInfo, additionalProductInfo, setAdditionalProductInfo, additionalRolesInfo, setAdditionalRolesInfo } = useContext(AdditionalContext);
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    targetStateSetter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    targetStateSetter(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/get-production-steps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          product: productInput,
          additionalCompanyInfo: additionalCompanyInfo,
          additionalProductInfo: additionalProductInfo
        }),
      });

      console.log('additonalCompanyInfo:', additionalCompanyInfo);
      console.log('additonalProductInfo:', additionalProductInfo);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data);
      setApiResponse(data);
    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Unbekannter Fehler!');
          }
    }
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
              product: productInput,
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

        {!apiResponse && (
          <form onSubmit={handleSubmit} className="mb-4">
              <div className="flex flex-col">
                  <label htmlFor="productInput" className="text-4xl font-semibold mb-8">
                      Welches Produkt wird in dem Werk produziert?
                  </label>
                  <input
                      type="text"
                      id="productInput"
                      name="productInput"
                      value={productInput}
                      onChange={(e) => handleInputChange(e, setProductInput)}
                      className="bg-white border border-gray-200 text-gray-900 text-lg rounded-md focus:ring-2 focus:ring-ring-color focus:ring-offset-0 focus:border-ring-color focus:outline-none shadow-sm p-3 mb-2"
                      placeholder="Konkreten Produktnamen eingeben"
                      required
                  />
                  <div className="mt-10">
                    <label className="text-xl font-semibold">
                      Optional: Zusätzliche Informationen zu der Firma:
                    </label><br></br>
                    <Textarea mt='15px'
                      value={additionalCompanyInfo}
                      onChange={(e) => handleInputChange(e, setAdditionalCompanyInfo)}
                      placeholder="Zusätzliche Informationen zu der Firma hinzufügen"
                    />
                  </div>
                  <div className="mt-10">
                    <label className="text-xl font-semibold">
                      Optional: Zusätzliche Informationen zu dem Produkt:
                    </label><br></br>
                    <Textarea mt='15px' mb='15px'
                      value={additionalProductInfo}
                      onChange={(e) => handleInputChange(e, setAdditionalProductInfo)}
                      placeholder="Zusätzliche Informationen zu dem Produkt hinzufügen"
                    />
                  </div>
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
        )}

        {isLoading && !apiResponse && (
            <LoaderComponent />
        )}

        {apiResponse && (
        <Box className="answer-box">
            <h2 className="h2-answer-box">Für dieses Produkt gibt es üblicherweise folgende Produktionsschritte:<br/><br/><i>Bitte klicke alle Schritte an, die auf dein Werk zutreffen.</i></h2>
            <div className="grid-answer-box">
            {apiResponse.split('\n').map((step, index: number) => (
                <Button
                height="auto"
                key={index}
                onClick={() => handleButtonClick(index)}
                sx={{
                  backgroundColor: clickedSteps.includes(index) ? '#0c4a6e' : '',
                  color: clickedSteps.includes(index) ? 'white' : 'black',
                  flex: '1'
                }}
              >
                {step}
              </Button>
            ))}
            </div>

            <div className="mt-10">
              <label htmlFor="additionalStep" className="text-xl font-semibold">
                Optional: Weitere Produktionsschritte:
              </label><br></br>
              <input
                type="text"
                id="additionalStep"
                name="additionalStep"
                value={additionalStep}
                onChange={(e) => handleInputChange(e, setAdditionalStep)}
                className="free-text-field mt-4 w-full resize-y"
                placeholder="Weitere Schritte hinzufügen"
              />
            </div>

            <div className="mt-10">
                    <label className="text-xl font-semibold">
                      Optional: Im nächsten Schritt werden Rollen für die Produktionsschritte vorgeschlagen. Bei Bedarf füge zusätzlichen Kontext zu den Rollen hinzu:
                    </label><br></br>
                    <Textarea mt='15px' mb='15px'
                      value={additionalRolesInfo}
                      onChange={(e) => handleInputChange(e, setAdditionalRolesInfo)}
                      placeholder="Zusätzlichen Kontext zu den Rollen hinzufügen"
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
