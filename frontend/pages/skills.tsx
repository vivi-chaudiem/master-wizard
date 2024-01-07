import React, { useEffect, useState, useContext } from 'react';
import StepperComponent from '../components/StepperComponent';
import LoaderComponent from '../components/LoaderComponent';
import { useRouter } from 'next/router';
import { Box, Button, ListItem, UnorderedList, Checkbox, Stack, Table, Thead, Tr, Th, Tbody, TableContainer, Td, Radio, Select, Input, RadioGroup } from '@chakra-ui/react';
import { toggleArrayValue } from '../utils/utils';
import { SkillsContext } from 'context/skillscontext';
import SkillsTableComponent from 'components/SkillsTableComponent';

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
  const { selectedSkills, setSelectedSkills } = useContext(SkillsContext);
  const [skillLevels, setSkillLevels] = useState({});
  const [skillsData, setSkillsData] = useState({});
  const [addingNewSkill, setAddingNewSkill] = useState(false);
  const [newSkillLevel, setNewSkillLevel] = useState('4');
  const [newSkillCategory, setNewSkillCategory] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [error, setError] = useState('');
  const activeStepIndex = 3;

  const handleButtonClick = (index) => {
    setClickedSkills((prev) => toggleArrayValue(prev, index));
  };

  const handleEdit = (roleIndex, category, skillIndex, newLevel) => {
    const skillKey = `${roleIndex}-${category}-${skillIndex}`;
    setSkillLevels(prev => ({ ...prev, [skillKey]: newLevel }));
  };

  const handleAddSkill = () => {
    setAddingNewSkill(true);
  };
  
  const handleRemoveSkill = (roleIndex, category, skillIndex) => {
    const categoryKey = `${roleIndex}-${category}`;
    setSkillsData(prev => {
      const updatedSkills = [...(prev[categoryKey] || [])];
      updatedSkills.splice(skillIndex, 1);  // Remove the skill
      return { ...prev, [categoryKey]: updatedSkills };
    });
  };

  const handleSaveNewSkill = (roleIndex) => {
    const categoryKey = `${roleIndex}-${newSkillCategory}`;
    const newSkill = { name: newSkillName, level: newSkillLevel };
    setSkillsData(prev => ({
      ...prev,
      [categoryKey]: [...(prev[categoryKey] || []), newSkill]
    }));
    setAddingNewSkill(false);
    setNewSkillName('');
    setNewSkillCategory('');
    setNewSkillLevel('4');
  };
  
  const handleCancelNewSkill = () => {
    setAddingNewSkill(false);
    setNewSkillName('');
    setNewSkillCategory('');
    setNewSkillLevel('4');
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
            console.log(data);
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
        {apiResponse && apiResponseObj.map((item, roleIndex) => (
          <div key={roleIndex}>
            <h3 className="h3-skill-title">{roleIndex + 1}. Rolle: {item.Rolle} ({item.Arbeitsschritt})</h3>

            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Kategorie</Th>
                    <Th>Kompetenz</Th>
                    <Th>4 Level</Th>
                    <Th>1 Level</Th>
                    <Th>Aktion</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Object.entries(item.Kompetenzen).map(([category, skills], categoryIndex) => (
                    <React.Fragment key={categoryIndex}>
                      {skills.map((skill, skillIndex) => {
                        const skillKey = `${roleIndex}-${category}-${skillIndex}`;
                        return (
                          <Tr key={skillIndex}>
                            {skillIndex === 0 && <Td rowSpan={skills.length}>{category}</Td>}
                            <Td>{skill}</Td>
                            <Td>
                              <Radio
                                isChecked={skillLevels[skillKey] !== '1'}
                                onChange={() => handleEdit(roleIndex, category, skillIndex, '4')}
                              >
                                4
                              </Radio>
                            </Td>
                            <Td>
                              <Radio
                                isChecked={skillLevels[skillKey] === '1'}
                                onChange={() => handleEdit(roleIndex, category, skillIndex, '1')}
                              >
                                1
                              </Radio>
                            </Td>
                            <Td>
                              <Button onClick={() => handleRemoveSkill(roleIndex, category, skillIndex)}>x</Button>
                            </Td>
                          </Tr>
                        );
                      })}
                    </React.Fragment>
                  ))}
                  {addingNewSkill && (
                    <Tr>
                      <Td>
                        <Select placeholder="Auswählen" value={newSkillCategory} onChange={(e) => setNewSkillCategory(e.target.value)}>
                          <option value="Basiskompetenzen">Basiskompetenzen</option>
                          <option value="Funktionale Kompetenzen">Funktionale Kompetenzen</option>
                          <option value="Methodenkompetenzen">Methodenkompetenzen</option>
                          <option value="Soft Skills">Soft Skills</option>
                        </Select>
                      </Td>
                      <Td>
                        <Input placeholder="Kompetenz" value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} />
                      </Td>
                      <Td>
                        <RadioGroup onChange={setNewSkillLevel} value={newSkillLevel}>
                          <Radio value="4">4</Radio>
                        </RadioGroup>
                      </Td>
                      <Td>
                        <RadioGroup onChange={setNewSkillLevel} value={newSkillLevel}>
                          <Radio value="1">1</Radio>
                        </RadioGroup>
                      </Td>
                      <Td>
                        <Button onClick={() => handleSaveNewSkill(roleIndex)}>+</Button>
                        <Button onClick={handleCancelNewSkill}>x</Button>
                      </Td>
                    </Tr>
                )}
                </Tbody>
              </Table>
              <Button onClick={handleAddSkill}>Hinzufügen</Button>
            </TableContainer>
          </div>
        ))}
      </div>
    );
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
        let apiResponseObj: ApiResponse[] = JSON.parse(apiResponse);

        const response = await fetch('http://127.0.0.1:8080/api/save-competencies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiResponseObj)
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || `Error: ${response.status}`);
        }

        console.log('Save successful:', result);
        router.push('/success');

      } catch (error: unknown) {
      if (error instanceof Error) {
          console.error('Error saving competencies:', error);
          setError(error.message || 'Unbekannter Fehler beim Speichern!');
          alert(error.message || 'Fehler beim Speichern!');
      } else {
          // Handle cases where the error is not an Error object
          console.error('An unexpected error occurred:', error);
          setError('Unbekannter Fehler beim Speichern!');
          alert('Unbekannter Fehler beim Speichern!');
      }
    }
  };

  // const handleConfirm = () => {
  //   // Collect selected skills and update the context
  //   setSelectedSkills(/* collected skills */);
  //   // Navigate to SkillLevelPage
  // };


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
          <h2 className="h2-answer-box">Für diese Rollen gibt es üblicherweise folgende Fähigkeiten.<br></br><br></br>Sofern die Fähigkeit zutrifft und übernommen werden soll, dokumentiere, ob die Fähigkeit 4 erreichbare Level hat &#40;Basis, Könner, Kenner, Profi&#41; oder lediglich 1 &#40;Fähigkeit muss vorhanden oder nicht vorhanden sein&#41;.</h2>
          {renderSkills()}
  
      {error && <div className="text-red-500">Error: {error}</div>}

      {/* <div className="flex justify-end">
        <Button onClick={handleSave}>Speichern</Button>
      </div> */}

      {/* <Button onClick={handleConfirm}>Bestätigen</Button> */}

      </Box>
  
        )}
    </div>
    );
};

export default SkillsPage;
