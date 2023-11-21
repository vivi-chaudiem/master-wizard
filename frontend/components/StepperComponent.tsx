// StepperComponent.js
import React from 'react';
import { useSteps, Stepper, Step, StepIndicator, StepStatus, StepIcon, StepNumber, StepTitle, StepDescription, StepSeparator, Box, Progress } from '@chakra-ui/react';

const steps = [
  { title: 'Produkt', description: 'Abfrage' },
  { title: 'Rollen', description: 'Validierung' },
  { title: 'Fähigkeiten', description: 'Validierung' },
];

const StepperComponent = ({ activeIndex }) => {
  return (
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
  );
};


export default StepperComponent;
