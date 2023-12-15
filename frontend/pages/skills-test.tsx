import { Box, ListItem, OrderedList, UnorderedList } from "@chakra-ui/react";

interface Competency {
    Basiskompetenzen: string[];
    Methodenkompetenzen: string[];
    FunktionaleKompetenzen: string[];
    SoftSkills: string[];
  }
  
interface ApiResponse {
  Arbeitsschritt: string;
  Rolle: string;
  Kompetenzen: Competency;
}

const SkillsTestPage = () => {
    const jsonData : ApiResponse[] = [{"Arbeitsschritt": "Montage der Pumpenkomponenten", "Rolle": "Verpacker", "Kompetenzen": {"Basiskompetenzen": ["Handgeschicklichkeit", "Konzentrationsfähigkeit"], "Methodenkompetenzen": ["Montagetechniken beherrschen"], "FunktionaleKompetenzen": ["Kenntnisse über Pumpenkomponenten"], "SoftSkills": ["Teamfähigkeit", "Zuverlässigkeit"]}}, {"Arbeitsschritt": "Verpackung der Pumpen", "Rolle": "Monteur", "Kompetenzen": {"Basiskompetenzen": ["Handgeschicklichkeit", "Konzentrationsfähigkeit"], "Methodenkompetenzen": ["Verpackungstechniken beherrschen"], "FunktionaleKompetenzen": ["Kenntnisse über Pumpen"], "SoftSkills": ["Effizientes Arbeiten", "Qualitätsbewusstsein"]}}, {"Arbeitsschritt": "Herstellung der einzelnen Pumpenkomponenten", "Rolle": "Hersteller", "Kompetenzen": {"Basiskompetenzen": ["Handgeschicklichkeit", "Konzentrationsfähigkeit"], "Methodenkompetenzen": ["Herstellungstechniken beherrschen"], "FunktionaleKompetenzen": ["Kenntnisse über Pumpenkomponenten"], "SoftSkills": ["Präzision", "Selbstständigkeit"]}}]

    const renderSkills = () => {
        let roleNumber = 1;

        return (
            jsonData.map((item, index) => (
                <div key={index}>
                <h3 className="h3-skill-title">{roleNumber++}. Rolle: {item.Rolle}</h3>
                <UnorderedList>
                  <ListItem><b>Arbeitsschritt: </b>{item.Arbeitsschritt}</ListItem>
                  <ListItem><b>Kompetenzen:</b></ListItem>
                </UnorderedList>
                  <div className="competency-container">
                    {Object.entries(item.Kompetenzen).map(([category, skills], categoryIndex) => (
                      <div key={categoryIndex} className="category-container">
                        <UnorderedList ml={10}>
                        <ListItem className="competency-category">{category}:</ListItem>
                          {(skills as string[]).map((skill, skillIndex) => (
                            <ListItem ml={10} key={skillIndex}>{skills.join(', ')}</ListItem>
                          ))}
                        </UnorderedList>
                      </div>
                    ))}
                  </div>
                </div>
          ))
        )
    }

    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-10">
       
          <Box className="answer-box">
              <h2 className="h2-answer-box">Für diese Rollen gibt es üblicherweise folgende Fähigkeiten:<br/><br/></h2>
              {renderSkills()}
            </Box>
      
        
         </div>
        );

}

export default SkillsTestPage;
