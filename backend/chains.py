from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from dbextensions import db
from dbmodels import Role, Competency

import json

# Production steps chain
def run_production_steps_chain(llm, product, additionalCompanyInfo, additionalProductInfo):
    ## Get existing production steps from the DB first
    existing_prod_steps = db.session.execute(db.select(Role.arbeitsschritt)).scalars().all()
    print(existing_prod_steps)

    # Ask for new production steps
    template = "Bitte erstelle eine detaillierte Liste von Arbeitsschritten, die spezifisch für die Produktion des Produkts '{product}' erforderlich sind, unter Berücksichtigung der folgenden zusätzlichen Informationen:\n- Produktinformationen: {additionalProductInfo}\n- Unternehmensinformationen: {additionalCompanyInfo}\nDeine Aufgabe ist es, eine gründliche Analyse dieser Informationen durchzuführen, um eine spezifische Liste von Arbeitsschritten zu entwickeln, die direkt mit der Herstellung des genannten Produkts verbunden sind. Anschließend sollst du diese spezifische Liste mit den bereits vorhandenen, generellen Arbeitsschritten auf semantische Überschneidungen vergleichen und deine Formulierung bei Bedarf anpassen, um Wiederholungen zu vermeiden, die folgendermaßen lauten: {existing_prod_steps}. Falls die Liste mit generellen Arbeitsschritten leer ist, überspringe diesen Schritt. Deine Antwort besteht nur aus der endgültigen Liste, die in einer nummerierten Form (z.B. '1.', '2.', '3.', etc.) präsentiert wird und keine Einleitung, zusätzliche Erklärungen oder Schlusssätze enthält.\nWichtig ist, dass die finale Liste der Arbeitsschritte direkt aus der Analyse der spezifischen Produkt- und Unternehmensinformationen abgeleitet wird. Sie soll nicht auf die in der übergebenen Liste enthaltenen Schritte beschränkt sein, aber dennoch semantische Überschneidungen mit dieser generellen Liste vermeiden."

    formatted_template = template.format(
        product=product,
        additionalProductInfo=additionalProductInfo,
        additionalCompanyInfo=additionalCompanyInfo,
        existing_prod_steps=existing_prod_steps
        )

    prompt = PromptTemplate(
        input_variables=["product", "additionalProductInfo", "additionalCompanyInfo", "existing_prod_steps"], 
        template=formatted_template
        )
    
    chain = LLMChain(llm=llm, prompt=prompt)

    print(prompt)

    return chain.run({"product": product, "additionalProductInfo": additionalProductInfo, "additionalCompanyInfo": additionalCompanyInfo, "existing_prod_steps": existing_prod_steps})

# Roles chain
def run_roles_chain(llm, product, production_steps, json_template, additionalCompanyInfo, additionalProductInfo, additionalRolesInfo):
    ## Get existing roles from the DB first
    existing_roles = db.session.execute(db.select(Role.arbeitsschritt, Role.bezeichnung)).all()
    print(existing_roles)

    json_string = json.dumps(json_template)
    escaped_json_string = json_string.replace("{", "{{").replace("}", "}}")

    template = "Angenommen, in der Produktion des Produkts '{product}' sind folgende Arbeitsschritte definiert: {production_steps}. Außerdem gibt es folgende zusätzliche Informationen:\nZum Produkt: {additionalProductInfo} \nZum Unternehmen: {additionalCompanyInfo}. Welche Rollen könnten diesen Arbeitsschritten zugeordnet werden? (Beispiel: Dem Arbeitsschritt 'Montage' könnte die Rolle 'Monteur' zugeordnet sein.) Anbei zusätzliche Informationen zu den Rollen: {additionalRolesInfo}. Außerdem anbei eine Liste mit Rollen und den dazugehörigen Arbeitsschritten, die bereits bekannt sind: {existing_roles}. Beachte, dass die Antwort nicht auf die vorgegebene Liste beschränkt ist und auch darüber hinausgehende Möglichkeiten berücksichtigt werden sollen. Wenn es semantische Überschneidungen bei den Rollen zwischen deiner Antwort und der Liste gibt, passe deine Formulierung entsprechend an, um Doppelungen zu vermeiden. Arbeitsschritte können mehrmals vorkommen, sofern es hierfür mehrere Rollen gibt. Weder Arbeitsschritt noch Rolle dürfen leere Werte beinhalten. Bitte gib mir deine Antwort direkt als JSON zurück (ohne einleitende Worte) und strukturiere die Antwort gemäß der folgenden Vorlage:\n"

    formatted_template = template.format(
        product=product,
        production_steps=production_steps,
        additionalProductInfo=additionalProductInfo,
        additionalCompanyInfo=additionalCompanyInfo,
        additionalRolesInfo=additionalRolesInfo,
        existing_roles=existing_roles
        ) + json.dumps(escaped_json_string)

    prompt = PromptTemplate(
        input_variables=["product", "production_steps", "additionalProductInfo", "additionalCompanyInfo", "additionalRolesInfo", "existing_roles"], template=formatted_template
        )
    
    chain = LLMChain(llm=llm, prompt=prompt)
    print(formatted_template)

    return chain.run({"product": product, "production_steps": production_steps, "additionalProductInfo": additionalProductInfo, "additionalCompanyInfo": additionalCompanyInfo, "additionalRolesInfo": additionalRolesInfo, "existing_roles": existing_roles})

# Skills chain
def run_skills_chain(llm, product, steps_and_roles_string, background_info, json_template):
    ## Get existing skills from the DB first
    existing_skills = db.session.execute(db.select(Competency.bezeichnung, Competency.kompetenz_typ)).all()
    print(existing_skills)

    json_string = json.dumps(json_template)
    escaped_json_string = json_string.replace("{", "{{").replace("}", "}}")

    template = "Angenommen in der Produktion von dem Produkt {product} gibt es Arbeitsschritte und dazugehörige Rollen: {steps_and_roles_string}. Außerdem gibt es folgende Kompetenzkategorien mit folgenden Definitionen: {background_info}. Bitte gib mir für jede dieser Rollen eine Liste an Fähigkeiten aus, die in den vorgegeben Kompetenzkategorien eingeordnet sind. Anbei eine Liste mit Fähigkeiten (bezeichnung) und den dazugehörigen Kategorien (kompetenz_typ), die bereits bekannt sind: {existing_skills}. Für deine Antwort, trenne die jeweiligen Abschnitte mit einem Komma und achte darauf, dass deine gesamte Antwort am Ende eine korrekte JSON-Struktur aufweisen muss. Für jede Kompetenzkategorie muss etwas ausgefüllt werden. Bitte gib mir deine Antwort direkt als JSON zurück (ohne einleitende Worte) und strukturiere die Antwort gemäß der folgenden Vorlage:\n"

    formatted_template = template.format(
        product=product,
        steps_and_roles_string=steps_and_roles_string,
        background_info=background_info,
        existing_skills=existing_skills
        ) + json.dumps(escaped_json_string)

    prompt = PromptTemplate(
        input_variables=["product", "steps_and_roles_string", "background_info", "existing_skills"],
        template=formatted_template
        )
    
    chain = LLMChain(llm=llm, prompt=prompt)
    print(formatted_template)

    return chain.run({"product": product, "steps_and_roles_string": steps_and_roles_string, "background_info": background_info, "existing_skills": existing_skills})