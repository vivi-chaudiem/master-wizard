import React, { createContext, useState, ReactNode } from 'react';

interface Competency {
  bezeichnung: string;
  maxlevel: string;
  targetlevel: string;
}

interface ListOfCompetencies {
  "Basiskompetenzen": Competency[];
  "Methodenkompetenzen": Competency[];
  "Funktionale Kompetenzen": Competency[];
  "Soft Skills": Competency[];
}

export interface ApiResponse {
  Arbeitsschritt: string;
  Rolle: string;
  Kompetenzen: ListOfCompetencies;
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
