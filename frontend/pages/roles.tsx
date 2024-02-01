import React, { useEffect, useState, useContext } from 'react';
import StepperComponent from '../components/StepperComponent';
import LoaderComponent from '../components/LoaderComponent';
import { useRouter } from 'next/router';
import { Box, Button, Table, Thead, Tr, Th, Tbody, Td, Input, TableContainer, Flex  } from '@chakra-ui/react';
import { toggleArrayValue } from '../utils/utils';
import { AdditionalContext } from 'context/additionalcontext';

interface ArbeitsschrittRolle {
  Arbeitsschritt: string;
  Rolle: string;
}

const RolesPage = () => {
  const router = useRouter();
  const [apiResponse, setApiResponse] = useState<ArbeitsschrittRolle[]>([]);
  const { additionalCompanyInfo, setAdditionalCompanyInfo, additionalProductInfo, setAdditionalProductInfo, additionalRolesInfo } = useContext(AdditionalContext);
  const [newArbeitsschritt, setNewArbeitsschritt] = useState('');
  const [newRolle, setNewRolle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [clickedRoles, setClickedRoles] = useState<number[]>([]);
  const [error, setError] = useState('');
  const activeStepIndex = 1;

  const handleButtonClick = (index) => {
    setClickedRoles((prev) => toggleArrayValue(prev, index));
  };

  const handleRemoveRole = (index: number) => {
    const updatedData = sortApiResponse(apiResponse.filter((_, i) => i !== index));
    setApiResponse(updatedData);
  };  
  
  const handleAdd = () => {
    if (newArbeitsschritt && newRolle) {
      const updatedData = sortApiResponse([...apiResponse, { Arbeitsschritt: newArbeitsschritt, Rolle: newRolle }]);
      setApiResponse(updatedData);
      setNewArbeitsschritt('');
      setNewRolle('');
    }
  };
  
  const sortApiResponse = (data: ArbeitsschrittRolle[]) => {
    return data.sort((a, b) =>
      a.Arbeitsschritt.localeCompare(b.Arbeitsschritt, undefined, { sensitivity: 'base' })
    );
  };  

  useEffect(() => {
    const product = router.query.product;
    const production_steps = Array.isArray(router.query.clickedSteps)
      ? JSON.parse(router.query.clickedSteps[0])
      : router.query.clickedSteps
      ? JSON.parse(router.query.clickedSteps)
      : [];
  
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/get-roles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product: product,
            production_steps: production_steps,
            additionalCompanyInfo: additionalCompanyInfo,
            additionalProductInfo: additionalProductInfo,
            additionalRolesInfo: additionalRolesInfo,
          }),
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
  
        const data = await response.json();
        const parsedData = JSON.parse(data); 
        const sortedData = sortApiResponse(parsedData);
        setApiResponse(sortedData);
  
        console.log("Neue Antwort:", data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unbekannter Fehler!');
        }
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [router.query, additionalCompanyInfo, additionalProductInfo, additionalRolesInfo]);  

  const handleConfirmClick = () => {
    console.log("Letzte apiResponse:", apiResponse);

    router.push({
        pathname: '/skills',
        query: {
          product: router.query.product,
          steps_and_roles_string: JSON.stringify(apiResponse),
    }});
  }

const renderSkills = () => {
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <Box overflowX="auto">
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Arbeitsschritt</Th>
                <Th>Rolle</Th>
                <Th>Aktion</Th>
              </Tr>
            </Thead>
            <Tbody>
              {apiResponse.map((item, index) => (
                <Tr key={index}>
                  <Td whiteSpace="normal">{item.Arbeitsschritt}</Td>
                  <Td whiteSpace="normal">{item.Rolle}</Td>
                  <Td whiteSpace="normal"><Button onClick={() => handleRemoveRole(index)}>x</Button></Td>
                </Tr>
              ))}
            </Tbody>
            </Table>
          
            <Flex width="100%" mt="4">
              <Input
                placeholder="Arbeitsschritt"
                value={newArbeitsschritt}
                onChange={(e) => setNewArbeitsschritt(e.target.value)}
                flex="4"
                mr="2"
              />
              <Input
                placeholder="Rolle"
                value={newRolle}
                onChange={(e) => setNewRolle(e.target.value)}
                flex="4"
                mr="2"
              />
              <Button
                onClick={handleAdd}
              >
                Hinzufügen
              </Button>
            </Flex>
        </TableContainer>
      </Box>
    </div>
  );
}

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-10">
      <div className="pb-20 width: '100%'">
        <StepperComponent activeIndex={activeStepIndex} />
      </div>
  
      {isLoading && (
              <LoaderComponent />
          )}

      {apiResponse.length > 0 && (
      <Box className="answer-box">
          <h2 className="h2-answer-box">Für diese Produktionsschritte gibt es üblicherweise folgende Rollen:<br/><br/><i>Bitte gebe die Rollen an, die auf dein Werk zutreffen.</i></h2>
          {renderSkills()}

          <div className="flex justify-end">
            <Button
              height="auto"
              onClick={handleConfirmClick}

              className="bg-blue-950 hover:bg-hover-color text-white font-bold py-2 px-4 rounded-md mt-4">
              Bestätigen
            </Button>
          </div>
      </Box>
      )}

      {error && <div className="text-red-500">Error: {error}</div>}
  
    </div>
  );
};

export default RolesPage;
