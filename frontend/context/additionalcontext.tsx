import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface AdditionalContextValue {
  additionalCompanyInfo: string;
  setAdditionalCompanyInfo: Dispatch<SetStateAction<string>>;
  additionalProductInfo: string;
  setAdditionalProductInfo: Dispatch<SetStateAction<string>>;
}

const defaultContextValue: AdditionalContextValue = {
  additionalCompanyInfo: '', 
  setAdditionalCompanyInfo: () => {},
  additionalProductInfo: '', 
  setAdditionalProductInfo: () => {},
};

export const AdditionalContext = createContext<AdditionalContextValue>(defaultContextValue);

export const AdditionalContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [additionalCompanyInfo, setAdditionalCompanyInfo] = useState<string>('');
  const [additionalProductInfo, setAdditionalProductInfo] = useState<string>('');

  const value = { 
    additionalCompanyInfo, 
    setAdditionalCompanyInfo,
    additionalProductInfo,
    setAdditionalProductInfo,
 };

  return (
    <AdditionalContext.Provider value={value}>
      {children}
    </AdditionalContext.Provider>
  );
};
