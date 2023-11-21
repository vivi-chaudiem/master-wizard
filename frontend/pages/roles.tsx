import React, { useEffect, useState } from 'react';
import StepperComponent from '../components/StepperComponent';
import LoadingComponent from '../components/LoaderComponent';
import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/react';

interface ApiResponse {
  steps: string[];
}

const RolesPage = () => {
  const router = useRouter();
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const activeStepIndex = 2;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await fetch('http://127.0.0.1:8080/api/get-roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product: router.query.product,
          production_steps: router.query.clickedSteps,
        }),
      });
      const data: ApiResponse = await response.json();
      setApiResponse(data);
      setIsLoading(false);
    };

    fetchData();
  }, [router.query]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-10">
      <div className="pb-20 width: '100%'">
            <StepperComponent activeIndex={activeStepIndex} />
        </div>        
      {isLoading && <LoadingComponent />}
      {apiResponse && (
        <div className="mt-4">
          {apiResponse.steps.map((step, index) => (
            <Button key={index} className="m-2">
                {step}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RolesPage;
