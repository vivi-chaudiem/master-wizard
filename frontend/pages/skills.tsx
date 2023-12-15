import React, { useEffect, useState } from 'react';
import StepperComponent from '../components/StepperComponent';
import LoaderComponent from '../components/LoaderComponent';
import { useRouter } from 'next/router';
import { Box, Button, ListItem, UnorderedList } from '@chakra-ui/react';
import { toggleArrayValue } from '../utils/utils';

interface Competency {
    Basiskompetenzen: string[];
    Methodenkompetenzen: string[];
    "Funktionale Kompetenzen": string[];
    "Soft Skills": string[];
  }
  
interface ApiResponse {
  Arbeitsschritt: string;
  Rolle: string;
  Kompetenzen: Competency;
}

const SkillsPage = () => {
  const router = useRouter();
  const [apiResponse, setApiResponse] = useState<string>("");
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
        }).then(function(response) {
          return response.json();
        }).then(function(data) {
            setApiResponse(data);
        }).catch( err =>  {
            console.log(err);
        });
      
        // if (!response.ok) {
        //   throw new Error(`Error: ${response.status}`);
        // }

        // const data = await response.json();
    
        // const indexOfBracket = data.indexOf('[');
        // if (indexOfBracket !== -1) {
        //   const trimmedData = data.substring(indexOfBracket);
        //   data = trimmedData;
        //   console.log('Data after trimming: ', data);
        // } else {
        //   console.log('No "[" character found in the text.');
        // }
        
        // setApiResponse(data);

      } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Unbekannter Fehler!');
          }
      } finally {
        setIsLoading(false);
      }

    }

    fetchData();
  }, [router.query]);
  
  function isObject(input: any): boolean {
    return typeof input === 'object' && input !== null;
  }

  function isString(input: any): boolean {
    return typeof input === 'string';
  }

  const renderSkills = () => {
    let roleNumber = 1;

    if (isLoading) {
      return <LoaderComponent />;
    }
  
    if (error) {
      return <div className="text-red-500">Error: {error}</div>;
    }

    console.log(apiResponse);

    let apiResponseObj: ApiResponse[] = JSON.parse(apiResponse);
    console.log('Arbeitsschritt: ', apiResponseObj[0].Arbeitsschritt);

    return (

      <div>
        {apiResponse && apiResponseObj.map((item, index) => (
          <div key={index}>
            <h3 className="h3-skill-title">{roleNumber++}. Rolle: {item.Rolle}</h3>
            <UnorderedList>
              <ListItem><b>Arbeitsschritt: </b>{item.Arbeitsschritt}</ListItem>
              <ListItem><b>Kompetenzen:</b></ListItem>
            </UnorderedList>
            <div className="competency-container">
              {Object.entries(item.Kompetenzen).map(([category, skills], categoryIndex) => (
                <div key={categoryIndex} className="category-container">
                  <UnorderedList ml={10}>
                    <ListItem className="competency-category">{category}:</ListItem>
                    {(skills as string[]).map((skill, skillIndex) => (
                      <ListItem ml={10} key={skillIndex}>{skill}</ListItem>
                    ))}
                  </UnorderedList>
                </div>
              ))}
            </div>
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
  
      {error && <div className="text-red-500">Error: {error}</div>}
      </Box>
  
        )}
     </div>
    );
};

export default SkillsPage;
