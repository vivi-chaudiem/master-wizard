import React, { useEffect, useState } from 'react';
import StepperComponent from '../components/StepperComponent';
import LoaderComponent from '../components/LoaderComponent';
import { useRouter } from 'next/router';
import { Box, Button } from '@chakra-ui/react';
import { toggleArrayValue } from '../utils/utils';

// interface ApiResponse {
//   steps: string[];
// }

const RolesPage = () => {
  const router = useRouter();
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [clickedRoles, setClickedRoles] = useState<number[]>([]);
  const [error, setError] = useState('');
  const activeStepIndex = 2;

  const handleButtonClick = (index) => {
    setClickedRoles((prev) => toggleArrayValue(prev, index));
  };

  useEffect(() => {
    const product = router.query.product;
    const production_steps = Array.isArray(router.query.clickedSteps)
    ? JSON.parse(router.query.clickedSteps[0])
    : router.query.clickedSteps
    ? JSON.parse(router.query.clickedSteps)
    : [];

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:8080/api/get-roles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product: product,
            production_steps: production_steps,
          }),
        });
    
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
    
        const data = await response.json();
        // console.log(data);
        // const steps = data.split('\n');
        setApiResponse(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Unbekannter Fehler!');
          }
    }
    };

    fetchData();
  }, [router.query]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-10">
      <div className="pb-20 width: '100%'">
        <StepperComponent activeIndex={activeStepIndex} />
      </div>
  
      {/* {isLoading && !apiResponse && <LoadingComponent />}
  
      {apiResponse && (
        <Box className="answer-box">
          <h2 className="h2-answer-box">Für diese Produktionsschritte gibt es üblicherweise folgende Rollen:<br/><br/><i>Bitte klicke alle Rollen an, die auf dein Werk zutreffen.</i></h2>
          <div className="grid-answer-box">
            {apiResponse.map((role, index) => (
              <Button
                key={index}
                onClick={() => handleButtonClick(index)}
                sx={{
                  backgroundColor: clickedSteps.includes(index) ? '#0c4a6e' : '',
                  color: clickedSteps.includes(index) ? 'white' : 'black',
                }}
              >
                {role}
              </Button>
            ))}
          </div>
        </Box>
      )} */}

      {isLoading && !apiResponse && (
              <LoaderComponent />
          )}

      {apiResponse && (
      <Box className="answer-box">
          <h2 className="h2-answer-box">Für diese Produktionsschritte gibt es üblicherweise folgende Rollen:<br/><br/><i>Bitte klicke alle Rollen an, die auf dein Werk zutreffen.</i></h2>
          <div className="grid-answer-box">
          {apiResponse.split('\n').map((step, index: number) => (
              <Button
              key={index}
              onClick={() => handleButtonClick(index)}
              sx={{
                backgroundColor: clickedRoles.includes(index) ? '#0c4a6e' : '',
                color: clickedRoles.includes(index) ? 'white' : 'black',
              }}
            >
              {step}
            </Button>
          ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => router.push({
                pathname: '/skills',
                query: { 
                  product: router.query.product,
                  production_steps: router.query.clickedSteps, 
                  roles: JSON.stringify(clickedRoles) }
              })}
              className="bg-blue-950 hover:bg-hover-color text-white font-bold py-2 px-4 rounded-md mt-4">
              Bestätigen
            </button>
          </div>
      </Box>
      )}

      {error && <div className="text-red-500">Error: {error}</div>}
  
    </div>
  );
};

export default RolesPage;
