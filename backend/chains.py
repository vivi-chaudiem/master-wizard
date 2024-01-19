from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from backend.dbextensions import db
from backend.dbmodels import Role, Competency

import json

# Production steps chain
def run_production_steps_chain(llm, product):
    ## Get existing production steps from the DB first
    existing_prod_steps = db.session.execute(db.select(Role.arbeitsschritt)).scalars().all()
    print(existing_prod_steps)

    # Ask for new production steps
    template = "Welche Fertigungslinien bzw. Arbeitsschritte könnten in der Produktion des Produkts {product} auftreten? Deine Antwort sollte mit '1.', '2.', '3.', etc. beginnen. Beachte, dass die Liste möglicher Arbeitsschritte nicht auf die in der übergebenen Liste enthaltenen beschränkt ist. Falls es semantische Überschneidungen mit den folgenden Begriffen gibt, passe deine Formulierung entsprechend an, um Dopplungen zu vermeiden: {existing_prod_steps} Bitte gib eine Liste ohne zusätzliche Erklärungen aus."

    formatted_template = template.format(
        product=product,
        existing_prod_steps=existing_prod_steps
        )

    prompt = PromptTemplate(
        input_variables=["product", "existing_prod_steps"], 
        template=formatted_template
        )
    
    chain = LLMChain(llm=llm, prompt=prompt)

    return chain.run({"product": product, "existing_prod_steps": existing_prod_steps})

# Roles chain
def run_roles_chain(llm, product, production_steps):
    ## Get existing roles from the DB first
    existing_roles = db.session.execute(db.select(Role.arbeitsschritt, Role.bezeichnung)).all()
    print(existing_roles)

    template = "Angenommen, in der Produktion des Produkts {product} sind folgende Arbeitsschritte definiert: {production_steps}. Welche Rollen könnten diesen Arbeitsschritten zugeordnet werden? (Beispiel: Dem Arbeitsschritt 'Montage' könnte die Rolle 'Monteur' zugeordnet sein.) Anbei eine Liste mit Rollen und den dazugehörigen Arbeitsschritten, die bereits bekannt sind: {existing_roles}. Beachte, dass die Antwort nicht auf die vorgegebene Liste beschränkt ist und auch darüber hinausgehende Möglichkeiten berücksichtigt werden sollen. Deine Antwort sollte mit '1.', '2.', '3.', etc. beginnen, und zwar in der Form '1. Monteur', ohne den dazugehörigen Arbeitsschritt zu wiederholen. Wenn es semantische Überschneidungen zwischen deiner Antwort und der Liste gibt, passe deine Formulierung entsprechend an, um Doppelungen zu vermeiden. Bitte gib eine einfache Liste mit den Rollen ohne zusätzliche Erklärungen aus."

    formatted_template = template.format(
        product=product,
        production_steps=production_steps,
        existing_roles=existing_roles
        )

    prompt = PromptTemplate(
        input_variables=["product", "production_steps", "existing_roles"], template=formatted_template
        )
    
    chain = LLMChain(llm=llm, prompt=prompt)
    print(formatted_template)

    return chain.run({"product": product, "production_steps": production_steps, "existing_roles": existing_roles})

# Skills chain
def run_skills_chain(llm, product, roles, production_steps, background_info, json_template):
    ## Get existing skills from the DB first
    existing_skills = db.session.execute(db.select(Competency.bezeichnung, Competency.kompetenz_typ)).all()
    print(existing_skills)

    json_string = json.dumps(json_template)
    escaped_json_string = json_string.replace("{", "{{").replace("}", "}}")

    template = "Angenommen in der Produktion von dem Produkt {product} gibt es folgende Rollen: {roles} und die zu folgenden Arbeitsschritten gehören: {production_steps}. Außerdem gibt es folgende Kompetenzkategorien mit folgenden Definitionen: {background_info}. Bitte gib mir für jede dieser Rollen eine Liste an Fähigkeiten aus, die in den vorgegeben Kompetenzkategorien eingeordnet sind. Anbei eine Liste mit Fähigkeiten (bezeichnung) und den dazugehörigen Kategorien (kompetenz_typ), die bereits bekannt sind: {existing_skills}. Für deine Antwort, trenne die jeweiligen Abschnitte mit einem Komma und achte darauf, dass deine gesamte Antwort am Ende eine korrekte JSON-Struktur aufweisen muss. Bitte gib mir deine Antwort direkt als JSON zurück (ohne einleitende Worte) und strukturiere die Antwort gemäß der folgenden Vorlage:\n"

    formatted_template = template.format(
        product=product,
        roles=roles,
        production_steps=production_steps,
        background_info=background_info,
        existing_skills=existing_skills
        ) + json.dumps(escaped_json_string)
    
    prompt = PromptTemplate(
        input_variables=["product", "roles", "production_steps", "background_info", "existing_skills"],
        template=formatted_template
        )
    
    chain = LLMChain(llm=llm, prompt=prompt)
    print(formatted_template)

    return chain.run({"product": product, "roles": roles, "production_steps": production_steps, "background_info": background_info, "existing_skills": existing_skills})
