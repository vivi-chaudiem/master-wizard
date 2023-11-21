import { Spinner } from '@chakra-ui/react';

const LoadingComponent = () => (
  <div className="flex items-center justify-center italic text-gray-500">
    <Spinner thickness='1px' speed='0.65s' emptyColor='gray.200' color='#0c4a6e' size='sm' />
    <span className="ml-2">Wizard verarbeitet die Anfrage...</span>
  </div>
);

export default LoadingComponent;