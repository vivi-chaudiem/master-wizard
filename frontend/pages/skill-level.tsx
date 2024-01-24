import { Box, Button, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import StepperComponent from "components/StepperComponent";
import { SkillsContext } from "context/skillscontext";
import { useRouter } from "next/router";
import React from "react";
import { useContext, useState } from "react";

const SkillLevelPage = () => {
  const router = useRouter();
  const activeStepIndex = 3;
  const { selectedSkills, setSelectedSkills } = useContext(SkillsContext);
  const [error, setError] = useState('');

  const handleLevelChange = (roleIndex, category, skillIndex, value) => {
    const updatedSkills = selectedSkills.map((role, index) => {
      if (index === roleIndex) {
        const updatedCompetencies = { ...role.Kompetenzen };
        updatedCompetencies[category] = updatedCompetencies[category].map((skill, idx) =>
          idx === skillIndex ? { ...skill, targetlevel: value } : skill
        );
  
        return { ...role, Kompetenzen: updatedCompetencies };
      }
      return role;
    });
  
    setSelectedSkills(updatedSkills);
  };  
  
  const handleSave = async () => {

    try {
        const response = await fetch('https://master-wizard-backend.onrender.com/api/save-competencies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(selectedSkills)
        });

        console.log('Sent body:', selectedSkills);

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

  const renderSkills = () => {
  
    if (error) {
      return <div className="text-red-500">Error: {error}</div>;
    }

    return (
      <div>
        {selectedSkills && selectedSkills.map((item, roleIndex) => (
          <div key={roleIndex}>
            <h3 className="h3-skill-title">{roleIndex + 1}. Rolle: {item.Rolle} ({item.Arbeitsschritt})</h3>
  
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Kategorie</Th>
                    <Th>Kompetenz</Th>
                    <Th>Max. Level</Th>
                    <Th>SOLL-Level</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Object.entries(item.Kompetenzen).map(([category, skills], categoryIndex) => (
                    <React.Fragment key={`${roleIndex}-${category}-${categoryIndex}`}>
                  {skills.map((skill, skillIndex) => (
                      <Tr key={`${roleIndex}-${category}-${skillIndex}`}>
                          {skillIndex === 0 && <Td rowSpan={skills.length}>{category}</Td>}
                          <Td>{skill.bezeichnung}</Td>
                          <Td>{skill.maxlevel}</Td>
                          <Td>
                            <NumberInput 
                              defaultValue={0} 
                              min={0} 
                              max={skill.maxlevel}
                              onChange={(value) => handleLevelChange(roleIndex, category, skillIndex, value)}
                              >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </Td>
                        </Tr>
                      ))}
                    </React.Fragment>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </div>
        ))}
      </div>
    );
   }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-10">
      <div className="pb-20 placeholder:width: '100%'">
        <StepperComponent activeIndex={activeStepIndex} />
      </div>

      <Box className="answer-box">

        <h2 className="h2-answer-box">Abschließend muss für jede Kompetenz das SOLL-Level dokumentiert werden.</h2>
        {renderSkills()}

        {error && <div className="text-red-500">Error: {error}</div>}

        <div className="flex justify-end">
          <Button onClick={handleSave}>Speichern</Button>
        </div> 

      </Box>
  
    </div>
    );
};

export default SkillLevelPage;
