import React, { useContext } from 'react';
import { SkillsContext } from './SkillsContext';
import { Table, Checkbox, Button } from '@chakra-ui/react';

const SkillLevelPage: React.FC = () => {
  const { selectedSkills } = useContext(SkillsContext);

  const renderSkillTable = (data: any) => {
    // Replace 'any' with your specific type for roleData
    return (
      <Table variant="simple">
        {/* Table headers and body */}
      </Table>
    );
  };

  return (
    <div>
      {selectedSkills.map((data, index) => (
        <div key={index}>
          <h3>{data.Rolle} ({data.Arbeitsschritt})</h3>
          {renderSkillTable(data)}
        </div>
      ))}
      <Button onClick={() => { /* Your save logic */ }}>Speichern</Button>
    </div>
  );
};

export default SkillLevelPage;
