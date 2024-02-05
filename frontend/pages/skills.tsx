import React, { useEffect, useState, useContext, use } from 'react';
import StepperComponent from '../components/StepperComponent';
import LoaderComponent from '../components/LoaderComponent';
import { useRouter } from 'next/router';
import { Box, Button, Table, Thead, Tr, Th, Tbody, TableContainer, Td, Radio, Select, Input, RadioGroup, Text } from '@chakra-ui/react';
import { toggleArrayValue } from '../utils/utils';
import { ApiResponse, SkillsContext } from 'context/skillscontext';

interface Competency {
  Basiskompetenzen: Skill[];
  Methodenkompetenzen: Skill[];
  "Funktionale Kompetenzen": Skill[];
  "Soft Skills": Skill[];
}

interface Skill {
  bezeichnung: string;
  maxlevel: string;
  targetlevel: string;
}

const SkillsPage = () => {
  const router = useRouter();
  const [apiResponse, setApiResponse] = useState<string>("");
  const [apiResponseObj, setApiResponseObj] = useState<ApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [clickedSkills, setClickedSkills] = useState<number[]>([]);
  const { selectedSkills, setSelectedSkills } = useContext(SkillsContext);
  const [addingNewSkill, setAddingNewSkill] = useState(false);
  const [newSkillLevel, setNewSkillLevel] = useState('4');
  const [newSkillCategory, setNewSkillCategory] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillStates, setNewSkillStates] = useState({});
  const [newSkillError, setNewSkillError] = useState({});
  const [error, setError] = useState('');
  const activeStepIndex = 2;

  const initializeNewSkillState = (roleIndex) => {
    setNewSkillStates(prev => ({
      ...prev,
      [roleIndex]: {
        newSkillLevel: '4',
        newSkillCategory: '',
        newSkillName: '',
        addingNewSkill: false
      }
    }));
  };

  const handleButtonClick = (index) => {
    setClickedSkills((prev) => toggleArrayValue(prev, index));
  };

  const handleAddSkill = (roleIndex) => {
    const { newSkillName, newSkillLevel, newSkillCategory } = newSkillStates[roleIndex];
    const newSkill = {
      bezeichnung: newSkillName,
      maxlevel: newSkillLevel,
      targetlevel: "0" 
    };
  
    // Validate the input
    if (!newSkillName || !newSkillCategory) {
      setNewSkillError(prev => ({
        ...prev,
        [roleIndex]: {
          nameError: !newSkillName,
          categoryError: !newSkillCategory,
        }
      }));
      return;
    }
  
    setApiResponseObj(prev => {
      const updated = [...prev];
      const categorySkills = updated[roleIndex].Kompetenzen[newSkillCategory] || [];
      updated[roleIndex].Kompetenzen[newSkillCategory] = [...categorySkills, newSkill];
      return updated;
    });

    setNewSkillStates(prev => ({
      ...prev,
      [roleIndex]: { ...prev[roleIndex], addingNewSkill: false, newSkillName: '', newSkillCategory: '', newSkillLevel: '4' }
    }));
  
    // Resetting the state
    setAddingNewSkill(false);
    setNewSkillName('');
    setNewSkillCategory('');
    setNewSkillLevel('4');

    // Reset the error state
    setNewSkillError(prev => ({
      ...prev,
      [roleIndex]: {
        nameError: false,
        categoryError: false,
      }
    }));
  };
  
  const handleRemoveSkill = (roleIndex, category, skillIndex) => {
    setApiResponseObj(prev => {
      const updated = [...prev];
      const categorySkills = updated[roleIndex].Kompetenzen[category];
      categorySkills.splice(skillIndex, 1);
      return updated;
    });
  };
  
  const handleEdit = (roleIndex, category, skillIndex, newLevel) => {
    setApiResponseObj(prev => {
      const updated = [...prev];
      const skill = updated[roleIndex].Kompetenzen[category][skillIndex];
      if (skill) {
        skill.maxlevel = newLevel;
      }
      return updated;
    });
  };

  const handleCancelNewSkill = (roleIndex) => {
    setNewSkillStates(prev => ({
      ...prev,
      [roleIndex]: { ...prev[roleIndex], addingNewSkill: false }
    }));
  };

  useEffect(() => {
    const product = router.query.product;
    const steps_and_roles_string = router.query.steps_and_roles_string;
    // const production_steps = router.query.production_steps;
    // const roles = Array.isArray(router.query.roles)
    // ? JSON.parse(router.query.roles[0])
    // : router.query.roles
    // ? JSON.parse(router.query.roles)
    // : [];

    // const fetchData = async () => {
    //   setIsLoading(true);
    //   try {
    //     const response = await fetch('/api/get-skills', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         product: product,
    //         steps_and_roles_string: steps_and_roles_string
    //       })
    //     });

    //     const data = await response.json();
    //     console.log('Data from fetchData:', data);
    //     // setApiResponse(data);
    //     const parsedData = JSON.parse(data);

    //     const transformedData = parsedData.map(item => ({
    //     ...item,
    //     Kompetenzen: Object.fromEntries(
    //       Object.entries(item.Kompetenzen).map(([category, skillNames]): [string, Skill[]] => [
    //         category, 
    //         (skillNames as string[]).map(skillName => ({ 
    //           bezeichnung: skillName, 
    //           maxlevel: '4', // Default value for maxlevel
    //           targetlevel: '0' // Default value for targetlevel
    //         }))
    //       ])
    //     )
    //   }));

    //   setApiResponseObj(transformedData);
    //   setIsLoading(false);
      

    //   // const transformItem = async (item) => {
    //   //   const transformedItem = {
    //   //     ...item,
    //   //     Kompetenzen: Object.fromEntries(
    //   //       await Promise.all(
    //   //         Object.entries(item.Kompetenzen).map(async ([category, skillNames]) => [
    //   //           category,
    //   //           await Promise.all(
    //   //             (skillNames as string[]).map(async (skillName) => ({
    //   //               bezeichnung: skillName,
    //   //               maxlevel: '4',
    //   //               targetlevel: '0',
    //   //             }))
    //   //           ),
    //   //         ])
    //   //       )
    //   //     ),
    //   //   };
    //   //   return transformedItem;
    //   // };

    //   // // Use Promise.all to transform all items in parallel
    //   // const transformedData = await Promise.all(parsedData.map(transformItem));

    //   setApiResponseObj(transformedData);
    //   console.log('transformedData:', transformedData);

    //     // Initialize newSkillStates for each role
    //     const initialSkillStates = {};
    //     parsedData.forEach((_, index) => {
    //       initialSkillStates[index] = {
    //         newSkillLevel: '4',
    //         newSkillCategory: '',
    //         newSkillName: '',
    //         addingNewSkill: false
    //       };
    //     });
    //     setNewSkillStates(initialSkillStates);

    //     setIsLoading(false);
    //   } catch (err: unknown) {
    //     if (err instanceof Error) {
    //         setError(err.message);
    //       } else {
    //         setError('Unbekannter Fehler!');
    //       }
    //   }

    // }

    const transformData = (parsedData) => {
      return parsedData.map(item => ({
        ...item,
        Kompetenzen: Object.fromEntries(
          Object.entries(item.Kompetenzen).map(([category, skillNames]): [string, Skill[]] => [
              category, 
              (skillNames as string[]).map(skillName => ({ 
              bezeichnung: skillName, 
              maxlevel: '4',
              targetlevel: '0'
            }))
          ])
        )
      }));
    };
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/get-skills', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product: router.query.product,
            steps_and_roles_string: router.query.steps_and_roles_string,
          }),
        });
    
        const data = await response.json();
        console.log('Data from fetchData:', data);
    
        // Assuming `data` needs to be parsed if it's a JSON string, otherwise use directly
        // const isValidJSON = (data) => {
        //   try {
        //     JSON.parse(data);
        //     return true;
        //   } catch (e) {
        //     return false;
        //   }
        // };
        
        // // Check if data is valid JSON
        // if (isValidJSON(data)) {
        //   const parsedData = JSON.parse(data);
        //   console.log('Data from parsedData:', parsedData);

        //   const transformedData = transformData(parsedData);
        //   console.log('Transformed Data:', transformedData);
        //   setApiResponseObj(transformedData);
        //   // Continue processing parsedData
        // } else {
        //   console.error('Invalid JSON data:', data);
        //   // Handle the error appropriately
        // }
        
        // const parsedData = JSON.parse(JSON.stringify(data));
        // console.log('Data from parsedData:', parsedData);

        if (!Array.isArray(data)) {
          console.error('Data is not an array:', data);
          const parsedData = JSON.parse(data);
          console.log('Data from parsedData:', parsedData);
          const transformedData = transformData(parsedData);
          console.log('Transformed Data:', transformedData);
          setApiResponseObj(transformedData);
        } else {
          const transformedData = transformData(data);
          console.log('Transformed Data:', transformedData);
          setApiResponseObj(transformedData);
        }
    
        // const transformedData = transformData(parsedData);
        // console.log('Transformed Data:', transformedData);
        // setApiResponseObj(transformedData);
      } catch (error) {
        console.error('Fetching error:', error);
        setError('An error occurred while fetching data.');
      } finally {
        setIsLoading(false);
      }
    };
    

    fetchData();
  }, [router.query]);

  const renderSkills = () => {
    // if (isLoading) {
    //   return <LoaderComponent />;
    // }
  
    if (error) {
      return <div className="text-red-500">Error: {error}</div>;
    }

    console.log('apiResponseObj in renderSkills:', apiResponseObj)
  
    return (
      <div>
        {apiResponseObj.length > 0 && apiResponseObj.map((item, roleIndex) => (
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
                  <React.Fragment key={`${roleIndex}-${category}-${categoryIndex}`}>
                    {skills.map((skill, skillIndex) => (
                      <Tr key={`${roleIndex}-${category}-${skillIndex}`}>
                        {skillIndex === 0 && <Td rowSpan={skills.length}>{category}</Td>}
                        <Td>{skill.bezeichnung}</Td>
                        <Td>
                          <Radio
                            isChecked={skill.maxlevel !== '1'}
                            onChange={() => handleEdit(roleIndex, category, skillIndex, '4')}
                          >
                            4
                          </Radio>
                        </Td>
                        <Td>
                          <Radio
                            isChecked={skill.maxlevel === '1'}
                            onChange={() => handleEdit(roleIndex, category, skillIndex, '1')}
                          >
                            1
                          </Radio>
                        </Td>
                        <Td>
                          <Button onClick={() => handleRemoveSkill(roleIndex, category, skillIndex)}>x</Button>
                        </Td>
                      </Tr>
                    ))}
                  </React.Fragment>
                  ))}
                  {newSkillStates[roleIndex]?.addingNewSkill && (
                    <Tr>
                      <Td>
                        <Select
                          placeholder="Auswählen"
                          value={newSkillStates[roleIndex].newSkillCategory}
                          onChange={(e) => setNewSkillStates(prev => ({
                            ...prev,
                            [roleIndex]: { ...prev[roleIndex], newSkillCategory: e.target.value }
                          }))}
                          isInvalid={newSkillError[roleIndex]?.categoryError}
                        >
                          <option value="Basiskompetenzen">Basiskompetenzen</option>
                          <option value="Funktionale Kompetenzen">Funktionale Kompetenzen</option>
                          <option value="Methodenkompetenzen">Methodenkompetenzen</option>
                          <option value="Soft Skills">Soft Skills</option>
                        </Select>
                        {newSkillError[roleIndex]?.categoryError && <Text mt="0.5em" color="red.500">Pflichtfeld</Text>}
                      </Td>
                      <Td>
                        <Input
                          placeholder="Kompetenz"
                          value={newSkillStates[roleIndex]?.newSkillName || ''}
                          onChange={(e) => setNewSkillStates(prev => ({
                            ...prev,
                            [roleIndex]: { ...prev[roleIndex], newSkillName: e.target.value }
                          }))}
                          isInvalid={newSkillError[roleIndex]?.nameError}
                        />
                        {newSkillError[roleIndex]?.nameError && <Text mt="0.5em" color="red.500">Pflichtfeld</Text>}
                      </Td>
                      <Td>
                        <RadioGroup onChange={(e) => setNewSkillStates(prev => ({
                          ...prev,
                          [roleIndex]: { ...prev[roleIndex], newSkillLevel: e }
                        }))} value={newSkillStates[roleIndex].newSkillLevel}>
                          <Radio value="4">4</Radio>
                        </RadioGroup>
                      </Td>
                      <Td>
                        <RadioGroup onChange={(e) => setNewSkillStates(prev => ({
                          ...prev,
                          [roleIndex]: { ...prev[roleIndex], newSkillLevel: e }
                        }))} value={newSkillStates[roleIndex].newSkillLevel}>
                          <Radio value="1">1</Radio>
                        </RadioGroup>
                      </Td>
                      <Td>
                        <Button className="mr-2" onClick={() => handleAddSkill(roleIndex)}>+</Button>
                        <Button onClick={() => handleCancelNewSkill(roleIndex)}>x</Button>
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
              {!newSkillStates[roleIndex]?.addingNewSkill ? (
                <Button className="mt-3" onClick={() => setNewSkillStates(prev => ({
                  ...prev,
                  [roleIndex]: { ...prev[roleIndex], addingNewSkill: true }
                }))}>Kompetenz hinzufügen</Button>
              ) : null}
            </TableContainer>
          </div>
        ))}
      </div>
    );
  };

  const handleConfirm = () => {
    console.log('apiResponseObj:', apiResponseObj);
    setSelectedSkills(apiResponseObj);

    router.push('/skill-level');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-10">
      <div className="pb-20 width: '100%'">
        <StepperComponent activeIndex={activeStepIndex} />
      </div>

      {isLoading && (
              <LoaderComponent />
          )}

      {apiResponseObj.length > 0 && (
      <Box className="answer-box">
          <h2 className="h2-answer-box">Nachfolgend werden die Fähigkeiten angezeigt, die es üblicherweise für diese Rollen gibt.<br></br><br></br>Sofern die Fähigkeit zutrifft und übernommen werden soll, dokumentiere, ob die Fähigkeit 4 maximal erreichbare Level hat &#40;Basis, Könner, Kenner, Profi&#41; oder 1 Level &#40;Fähigkeit muss vorhanden oder nicht vorhanden sein&#41;.</h2>
          {renderSkills()}
  
      {error && <div className="text-red-500">Error: {error}</div>}

      {/* <div className="flex justify-end">
        <Button onClick={handleSave}>Speichern</Button>
      </div> */}

      <div className="flex justify-end">
        <Button onClick={handleConfirm}>Bestätigen</Button>
      </div>

      </Box>
  
        )}
    </div>
    );
};

export default SkillsPage;
