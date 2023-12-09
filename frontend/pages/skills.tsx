import React, { useEffect, useState } from 'react';
import StepperComponent from '../components/StepperComponent';
import LoaderComponent from '../components/LoaderComponent';
import { useRouter } from 'next/router';
import { Box, Button } from '@chakra-ui/react';
import { toggleArrayValue } from '../utils/utils';


const SkillsPage = () => {
  const router = useRouter();
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [clickedSkills, setClickedSkills] = useState<number[]>([]);
  const [error, setError] = useState('');
  const activeStepIndex = 3;

  const handleButtonClick = (index) => {
    setClickedSkills((prev) => toggleArrayValue(prev, index));
  };

  useEffect(() => {
    const product = router.query.product;
    const production_steps = router.query.production_steps;
    const roles = Array.isArray(router.query.roles)
    ? JSON.parse(router.query.roles[0])
    : router.query.roles
    ? JSON.parse(router.query.roles)
    : [];

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:8080/api/get-skills', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product: product,
            production_steps: production_steps,
            roles: roles,
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

      {isLoading && !apiResponse && (
              <LoaderComponent />
          )}

      {apiResponse && (
      <Box className="answer-box">
          <h2 className="h2-answer-box">Für diese Rollen gibt es üblicherweise folgende Fähigkeiten:<br/><br/></h2>

        <div>
            {apiResponse.split('\n').map((step, index: number) => (
            <p key={index}>{step}</p>
            ))}
        </div>
{/* 
        {apiResponse.split('\n').map((item, index) => (
            <div key={index} className="item-box">
                <div className="role">Rolle: {item.Rolle}</div>
                <div className="step">Arbeitsschritt: {item.Arbeitsschritt}</div>
                
                <div className="competencies">
                    <div className="competency-title">Basiskompetenzen:</div>
                    <ul>
                        {item.Kompetenzen.Basiskompetenzen.map((skill, skillIndex) => (
                            <li key={skillIndex}>{skill}</li>
                        ))}
                    </ul>

                    <div className="competency-title">Methodenkompetenzen:</div>
                    <ul>
                        {item.Kompetenzen.Methodenkompetenzen.map((skill, skillIndex) => (
                            <li key={skillIndex}>{skill}</li>
                        ))}
                    </ul>

                    <div className="competency-title">Funktionale Kompetenzen:</div>
                    <ul>
                        {item.Kompetenzen['Funktionale Kompetenzen'].map((skill, skillIndex) => (
                            <li key={skillIndex}>{skill}</li>
                        ))}
                    </ul>

                    <div className="competency-title">Soft Skills:</div>
                    <ul>
                        {item.Kompetenzen['Soft Skills'].map((skill, skillIndex) => (
                            <li key={skillIndex}>{skill}</li>
                        ))}
                    </ul>
                </div>
            </div>
        ))} */}


          {/* <div className="grid-answer-box">
          {apiResponse.split('\n').map((step, index: number) => (
              <Button
              key={index}
              onClick={() => handleButtonClick(index)}
              sx={{
                backgroundColor: clickedSkills.includes(index) ? '#0c4a6e' : '',
                color: clickedSkills.includes(index) ? 'white' : 'black',
              }}
            >
              {step}
            </Button>
          ))}
          </div> */}

          {/* <div className="flex justify-end">
            <button
              onClick={() => router.push({
                pathname: '/skills',
                query: { 
                  product: router.query.product,
                  production_steps: router.query.clickedSteps, 
                  roles: JSON.stringify(clickedSkills) }
              })}
              className="bg-blue-950 hover:bg-hover-color text-white font-bold py-2 px-4 rounded-md mt-4">
              Bestätigen
            </button>
          </div> */}
      </Box>
      )}

      {error && <div className="text-red-500">Error: {error}</div>}
  
    </div>
  );
};

export default SkillsPage;
