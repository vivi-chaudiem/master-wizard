// StepperComponent.js
import React from 'react';
import { useSteps, Stepper, Step, StepIndicator, StepStatus, StepIcon, StepNumber, StepTitle, StepDescription, StepSeparator, Box } from '@chakra-ui/react';

const steps = [
  { title: 'Willkommen', description: 'Einleitung' },
  { title: 'Produkt', description: 'Abfrage' },
  { title: 'Weiteres', description: 'Ganz viele andere tolle Sachen' },
];

const StepperComponent = ({ activeIndex }) => {
  return (
    <Stepper size='lg' colorScheme='blue' index={activeIndex}>
      {steps.map((step, index) => (
        <Step key={index}>
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>

          <Box flexShrink='0'>
            <StepTitle>{step.title}</StepTitle>
            <StepDescription>{step.description}</StepDescription>
          </Box>

          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  );
};

export default StepperComponent;
