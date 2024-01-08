import React, { createContext, useState, ReactNode } from 'react';

// Define the structure for ApiResponse
interface ApiResponse {
  Arbeitsschritt: string;
  Rolle: string;
  Kompetenzen: ListOfCompetencies;
}

interface ListOfCompetencies {
  "Basiskompetenzen": string[];
  "Methodenkompetenzen": string[];
  "Funktionale Kompetenzen": string[];
  "Soft Skills": string[];
}

interface Competency {
  bezeichnung: string;
  maxlevel: string;
}

// Context type
interface SkillsContextType {
  selectedSkills: ApiResponse[];
  setSelectedSkills: (skills: ApiResponse[]) => void;
}

// Create the context
export const SkillsContext = createContext<SkillsContextType>({} as SkillsContextType);

// Provider component type
interface SkillsProviderProps {
  children: ReactNode;
}

// Provider component
export const SkillsProvider: React.FC<SkillsProviderProps> = ({ children }) => {
  const [selectedSkills, setSelectedSkills] = useState<ApiResponse[]>([]);

  return (
    <SkillsContext.Provider value={{ selectedSkills, setSelectedSkills }}>
      {children}
    </SkillsContext.Provider>
  );
};
