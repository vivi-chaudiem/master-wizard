import React, { useEffect, useState } from 'react';
import StepperComponent from '../components/StepperComponent';
import LoaderComponent from '../components/LoaderComponent';
import { useRouter } from 'next/router';
import { Box, Button } from '@chakra-ui/react';
import { toggleArrayValue } from '../utils/utils';

const RolesPage = () => {
  const router = useRouter();
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [clickedRoles, setClickedRoles] = useState<number[]>([]);
  const [additionalRole, setAdditionalRole] = useState('');
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

  const handleAdditionalRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdditionalRole(e.target.value);
  };

  const handleConfirmClick = () => {
    if (apiResponse) {
      const selectedRoles = clickedRoles.map((index) => {
          const stepText = apiResponse.split('\n')[index];
          return stepText.replace(/^\d+\.\s*/, '').trim();
      });
      
      // Add the additional step if it's not empty
      if (additionalRole.trim() !== '') {
        selectedRoles.push(additionalRole.trim());
      }

      router.push({
          pathname: '/skills',
          query: {
            product: router.query.product,
            production_steps: router.query.clickedSteps, 
            roles: JSON.stringify(selectedRoles),
      }});

  } else {
      console.error('apiResponse is null');
  }
};

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-10">
      <div className="pb-20 width: '100%'">
        <StepperComponent activeIndex={activeStepIndex} />
      </div>
  
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

          <div className="mt-10">
              <label htmlFor="additionalRole" className="text-xl font-semibold">
                Weitere Rollen (optional):
              </label><br></br>
              <input
                type="text"
                id="additionalRole"
                name="additionalRole"
                value={additionalRole}
                onChange={handleAdditionalRoleChange}
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
  );
};

export default RolesPage;
