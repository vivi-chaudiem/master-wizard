import React, { useEffect, useState } from 'react';
import StepperComponent from '../components/StepperComponent';
import LoaderComponent from '../components/LoaderComponent';
import { useRouter } from 'next/router';
import { Box, Button } from '@chakra-ui/react';
import { toggleArrayValue } from '../utils/utils';

interface Competency {
    "Basiskompetenzen": string[];
    "Methodenkompetenzen": string[];
    "Funktionale Kompetenzen": string[];
    "Soft Skills": string[];
  }
  
interface Skill {
  Arbeitsschritt: string;
  Rolle: string;
  Kompetenzen: Competency;
}

const SkillsPage = () => {
  const router = useRouter();
  const [apiResponse, setApiResponse] = useState<any | null>(null);
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

        // const data = await response.text(); // Read response as text
        // console.log(data);

        // // // Wrap data in square brackets and replace separating commas
        // // const formattedData = `[${data.trim()}]`;

        // // Parse the formatted data
        // const parsedData = JSON.parse(data);
        // console.log(parsedData);

        const data = await response.json();
        console.log('API Data:', data); // Check the structure of the API data
        setApiResponse(data);

      } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Unbekannter Fehler!');
          }
        } finally {
          setIsLoading(false); // Ensure isLoading is set to false in both success and error scenarios
        }

    }

    fetchData();
  }, [router.query]);

  const renderCompetencies = (competencies: Competency) => {
    return (
      <div>
        {Object.entries(competencies).map(([category, skills], index) => (
          <div key={index}>
            <h4>{category}</h4>
            <ul>
              {skills.map((skill, skillIndex) => (
                <li key={skillIndex}>{skill}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };
  

  const renderSkills = () => {
    console.log('Render API Response:', apiResponse); // Debugging
    const skillsArray = Array.isArray(apiResponse) ? apiResponse : [apiResponse];

    if (isLoading) {
      return <LoaderComponent />;
    }
  
    if (error) {
      return <div className="text-red-500">Error: {error}</div>;
    }
  
    if (!Array.isArray(apiResponse)) {
      console.error('apiResponse is not an array:', apiResponse);
      return <div>Error: Response data is not in the expected format.</div>;
    }
  
    if (apiResponse.length === 0) {
      return <div>No data available.</div>;
    }
  
    return (
      <div>
        {skillsArray.map((skill, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <h3>Arbeitsschritt: {skill.Arbeitsschritt}</h3>
            <p>Rolle: {skill.Rolle}</p>
            <h4>Kompetenzen:</h4>
            {renderCompetencies(skill.Kompetenzen)}
          </div>
        ))}
      </div>
    );
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
          <h2 className="h2-answer-box">Für diese Rollen gibt es üblicherweise folgende Fähigkeiten:<br/><br/></h2>
          {renderSkills()}
        {/* <div>
            {apiResponse.split('\n').map((step, index: number) => (
            <p key={index}>{step}</p>
            ))}
        </div> */}
        
      {error && <div className="text-red-500">Error: {error}</div>}
      </Box>
  
        )}
     </div>
    );
};

export default SkillsPage;
