// StepperComponent.js
import React from 'react';
import { useSteps, Stepper, Step, StepIndicator, StepStatus, StepIcon, StepNumber, StepTitle, StepDescription, StepSeparator, Box, Progress } from '@chakra-ui/react';

const steps = [
  { title: 'Produkt', description: 'Produktionsschritte' },
  { title: 'Rollen', description: 'Pro Produktionsschritt' },
  { title: 'Fähigkeiten', description: 'Max. Level' },
  { title: 'Fähigkeiten', description: 'Soll-Level' },
  { title: 'Fertig!', description: 'Datenspeicherung' },
];

const StepperComponent = ({ activeIndex }) => {
  return (
    <Box marginTop="5rem">
      <Stepper size='lg' colorScheme='customBlue' index={activeIndex}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator >

              <Box flexShrink='1'>
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </Box>

            <Box>
              <StepSeparator />
            </Box>
            
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};


export default StepperComponent;
