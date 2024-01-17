from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.agents import create_sql_agent
from langchain.agents.agent_types import AgentType
from langchain.sql_database import SQLDatabase
from langchain.agents.agent_toolkits import SQLDatabaseToolkit
from langchain.agents.agent_types import AgentType
from langchain.chat_models import ChatOpenAI
from flask import current_app
from backend.dbextensions import db
from backend.dbmodels import Role, Competency

import json
import dotenv
import os
import openai

# def get_db_uri():
#     return current_app.config['SQLALCHEMY_DATABASE_URI']

# # Standardization of production steps chain
# def standardize_production_steps():
#     db_uri=get_db_uri()
#     db=SQLDatabase.from_uri(db_uri)

#     # Load environment variables
#     dotenv.load_dotenv()
#     openai.api_key = os.getenv("OPEN_AI_API_KEY")

#     llm = ChatOpenAI(
#         openai_api_key=openai.api_key, 
#         model_name="gpt-3.5-turbo",
#         temperature=0
#         )

#     toolkit = SQLDatabaseToolkit(
#         db=db,
#         llm=llm
#     )
    
#     agent_executor = create_sql_agent(
#         llm=llm,
#         toolkit=toolkit,
#         verbose=True,
#         agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
#         return_only_outputs=True
#     )
#     return agent_executor.run("Wie viele Arbeitsschritte gibt es? Wenn es mindestens 1 Arbeitsschritt gibt, gib mir eine Liste mit allen Arbeitsschritten aus.")

# Production steps chain
def run_production_steps_chain(llm, product):
    # # Get existing production steps from the DB first
    existing_prod_steps = db.session.execute(db.select(Role.arbeitsschritt)).scalars().all()
    print(existing_prod_steps)

    # Ask for new production steps
    template = "Welche Fertigungslinien bzw. Arbeitsschritte könnten in der Produktion des Produkts {product} auftreten? Deine Antwort sollte mit '1.', '2.', '3.', etc. beginnen. Beachte, dass die Liste möglicher Arbeitsschritte nicht auf die in der übergebenen Liste enthaltenen beschränkt ist. Falls es semantische Überschneidungen mit den folgenden Begriffen gibt, passe deine Formulierung entsprechend an, um Dopplungen zu vermeiden: {existing_prod_steps} Bitte gib eine Liste ohne zusätzliche Erklärungen aus."

    formatted_template = template.format(
        product=product,
        existing_prod_steps=existing_prod_steps
        )

    prompt = PromptTemplate(
        input_variables=["product, existing_prod_steps"], 
        template=formatted_template
        )
    
    chain = LLMChain(llm=llm, prompt=prompt)

    return chain.run({"product": product, "existing_prod_steps": existing_prod_steps})

# Roles chain
def run_roles_chain(llm, product, production_steps):
    template = "Angenommen in der Produktion von dem Produkt {product} gibt es folgende Arbeitsschritte {production_steps}. Welche Rollen könnte es für jede dieser Arbeitsschritte geben? (Beispiel: Zu dem Produktionsschritt 'Montage' könnte es die Rolle 'Monteur' geben.) Ein Arbeitsschritt kann auch mehrere Rollen enthalten. Bitte gib eine einfache Liste mit den Rollen ohne zusätzliche Erklärungen, ohne Dopplungen und ohne den dazugehörigen Produktionsschritt aus. Beginne deine Antwort direkt mit der Aufzählung (1., 2., etc.), also zum Beispiel '1. Monteur' und auf KEINEN Fall in der Form '1. Montage: - Monteur'."

    formatted_template = template.format(
        product=product,
        production_steps=production_steps
        )

    prompt = PromptTemplate(
        input_variables=["product", "production_steps"], template=formatted_template
        )
    
    chain = LLMChain(llm=llm, prompt=prompt)
    print(formatted_template)

    return chain.run({"product": product, "production_steps": production_steps})

# Skills chain
def run_skills_chain(llm, product, roles, production_steps, background_info, json_template):

    json_string = json.dumps(json_template)
    escaped_json_string = json_string.replace("{", "{{").replace("}", "}}")


    template = "Angenommen in der Produktion von dem Produkt {product} gibt es folgende Rollen: {roles} und die zu folgenden Arbeitsschritten gehören: {production_steps}. Außerdem gibt es folgende Kompetenzkategorien mit folgenden Definitionen: {background_info}. Bitte gib mir für jede dieser Rollen eine Liste an Fähigkeiten aus, die in den vorgegeben Kompetenzkategorien eingeordnet sind. Trenne die jeweiligen Abschnitte mit einem Komma und achte darauf, dass deine gesamte Antwort am Ende eine korrekte JSON-Struktur aufweisen muss. Bitte gib mir deine Antwort direkt als JSON zurück (ohne einleitende Worte) und strukturiere die Antwort gemäß der folgenden Vorlage:\n"

    formatted_template = template.format(
        product=product,
        roles=roles,
        production_steps=production_steps,
        background_info=background_info
        ) + json.dumps(escaped_json_string)
    
    prompt = PromptTemplate(
        input_variables=["product", "roles", "production_steps", "background_info"],
        template=formatted_template
        )
    
    chain = LLMChain(llm=llm, prompt=prompt)
    print(formatted_template)

    return chain.run({"product": product, "roles": roles, "production_steps": production_steps, "background_info": background_info})
