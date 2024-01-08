import { Box, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import StepperComponent from "components/StepperComponent";
import { SkillsContext } from "context/skillscontext";
import React from "react";
import { useContext, useState } from "react";


const SkillLevelPage = () => {
  const activeStepIndex = 3;
  const { selectedSkills } = useContext(SkillsContext);
  const [error, setError] = useState('');

  console.log(selectedSkills);

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
                    <React.Fragment key={categoryIndex}>
                      {skills.map((skill, skillIndex) => (
                        <Tr key={`${roleIndex}-${category}-${skillIndex}`}>
                          {skillIndex === 0 && <Td rowSpan={skills.length}>{category}</Td>}
                          <Td>{skill.bezeichnung}</Td>
                          <Td>{skill.maxlevel}</Td>
                          <Td>
                            <NumberInput defaultValue={0} min={0} max={skill.maxlevel}>
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

        {/* <div className="flex justify-end">
          <Button onClick={handleSave}>Speichern</Button>
        </div> */}

        </Box>
  
    </div>
    );
};

export default SkillLevelPage;
