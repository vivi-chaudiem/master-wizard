import React, { useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Select, Input, Button, RadioGroup, Radio, Stack } from '@chakra-ui/react';

const SkillsTable = ({ skills, setSkills }) => {
  const categories = ['Basiskompetenzen', 'Methodenkompetenzen', 'Funktionale Kompetenzen', 'Soft Skills'];

  const handleSkillChange = (index, value) => {
    const updatedSkills = skills.map((skill, i) => {
      if (i === index) {
        return { ...skill, name: value };
      }
      return skill;
    });
    setSkills(updatedSkills);
  };

  const handleCategoryChange = (index, value) => {
    const updatedSkills = skills.map((skill, i) => {
      if (i === index) {
        return { ...skill, category: value };
      }
      return skill;
    });
    setSkills(updatedSkills);
  };

  const handleLevelChange = (index, value) => {
    const updatedSkills = skills.map((skill, i) => {
      if (i === index) {
        return { ...skill, level: value };
      }
      return skill;
    });
    setSkills(updatedSkills);
  };

  const handleAddSkill = () => {
    setSkills([...skills, { category: categories[0], name: '', level: '4' }]);
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
  };

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Kategorie</Th>
          <Th>Kompetenz</Th>
          <Th>4 Level</Th>
          <Th>1 Level</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {skills.map((skill, index) => (
          <Tr key={index}>
            <Td>
              <Select value={skill.category} onChange={(e) => handleCategoryChange(index, e.target.value)}>
                {categories.map(category => <option key={category} value={category}>{category}</option>)}
              </Select>
            </Td>
            <Td>
              <Input value={skill.name} onChange={(e) => handleSkillChange(index, e.target.value)} />
            </Td>
            <Td>
              <RadioGroup onChange={(value) => handleLevelChange(index, value)} value={skill.level}>
                <Radio value="4">4</Radio>
              </RadioGroup>
            </Td>
            <Td>
              <RadioGroup onChange={(value) => handleLevelChange(index, value)} value={skill.level}>
                <Radio value="1">1</Radio>
              </RadioGroup>
            </Td>
            <Td>
              <Button colorScheme="red" onClick={() => handleRemoveSkill(index)}>Remove</Button>
            </Td>
          </Tr>
        ))}
      </Tbody>
      <Button mt={4} onClick={handleAddSkill}>Add Skill</Button>
    </Table>
  );
};

export default SkillsTable;
