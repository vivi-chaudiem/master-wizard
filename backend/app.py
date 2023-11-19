# from flask import Flask
from langchain.prompts import PromptTemplate
from langchain.chat_models import ChatOpenAI
from langchain.schema import StrOutputParser
from langchain.chains import LLMChain
from pathlib import Path
import dotenv
import os
import openai
import json

# Create Flask app
# app = Flask(__name__)

# Read background information from txt file
def read_background_info(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()
    
def read_json_description(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

def main():
    # Load environment variables
    dotenv.load_dotenv()

    # Set OpenAI API key and create LLM
    openai.api_key = os.getenv("OPEN_AI_API_KEY")
    llm = ChatOpenAI(
        openai_api_key=openai.api_key,
        model_name="gpt-3.5-turbo",
    )   

    # Initial user input
    # product = input("Welches Produkt wird in dem Werk produziert? ")

    # Prompt templates
    # production_steps_template_str = "Welche Fertigungslinien bzw. Arbeitsschritte könnten in der Produktion von dem Produkt {product} vorkommen? Bitte gib eine Liste ohne zusätzliche Erklärungen aus."
    # formatted_production_steps_template = production_steps_template_str.format(product=product)

    # roles_template_str = "Angenommen in der Produktion von dem Produkt {product} gibt es folgende Arbeitsschritte {production_steps}. Welche Rollen könnte es jede dieser Arbeitsschritte geben? Bitte gib eine Liste ohne zusätzliche Erklärungen aus."
    # formatted_roles_template = roles_template_str.format(product=product, production_steps=production_steps_response)

    production_steps_prompt = PromptTemplate.from_template(
        "Welche Fertigungslinien bzw. Arbeitsschritte könnten in der Produktion von dem Produkt {product} vorkommen? Bitte gib eine Liste ohne zusätzliche Erklärungen aus."
    )

    roles_template_prompt = PromptTemplate.from_template(
        "Angenommen es gibt folgende Arbeitsschritte {production_steps} in einer Produktion. Welche Rollen könnte es jede dieser Arbeitsschritte geben? Bitte gib eine Liste ohne zusätzliche Erklärungen aus."
    )

    chain = (
        {"production_steps": production_steps_prompt | llm | StrOutputParser()}
        | roles_template_prompt
        | llm
        | StrOutputParser()
    )

    product = input("Welches Produkt wird in dem Werk produziert? ")

    output = chain.invoke({"product": product})
    print(output)

    # 1. Chain: Production steps

    # Create prompt
    # prompt_production_steps = PromptTemplate(
    #     input_variables=["product"], template=formatted_production_steps_template
    # )

    # # Chain for production steps
    # production_steps_chain = LLMChain(llm=llm, prompt=prompt_production_steps)

    # # Define input variables for the chain
    # input_variables = {"product": product}

    # # Get production steps from OpenAI
    # production_steps_response = production_steps_chain.run(input_variables)
    # print("\nArbeitsschritte:")
    # print(production_steps_response)

    # # 2. Chain: Roles

    # # Create prompt template
    

    # # Create prompt
    # prompt_roles = PromptTemplate(
    #     input_variables=["product", "production_steps"], template=formatted_roles_template
    # )

    # # Chain for roles
    # roles_chain = LLMChain(llm=llm, prompt=prompt_roles)

    # # Define input variables for the chain
    # input_variables = {"product": product, "production_steps": production_steps_response}

    # # Get roles from OpenAI
    # roles_response = roles_chain.run(input_variables)
    # print("\nRollen:")
    # print(roles_response)

    # 3. Chain Skills

    # # Load background information
    # background_info_path = "backend/documents/background_info.txt" 
    # background_info = read_background_info(background_info_path)

    # # Load the JSON-style template as a raw string
    # skills_json_template_path = "backend/documents/skills_json_description.txt"
    # with open(skills_json_template_path, 'r', encoding='utf-8') as file:
    #     skills_json_template_raw = file.read()

    # # Construct the prompt using string concatenation
    # skills_template_str = (
    #     "Angenommen in der Produktion von dem Produkt {product} gibt es folgende Rollen: {roles} und die zu folgenden Arbeitsschritten gehören: {production_steps}. Außerdem gibt es folgende Kompetenzkategorien mit folgenden Definitionen: {background_info}. Bitte gib mir für die erste Rolle eine Liste an Fähigkeiten aus, die in den vorgegeben Kompetenzkategorien eingeordnet sind. Bitte strukturiere die Antwort gemäß der folgenden JSON-Vorlage für jede einzigartige Rolle:\n" + skills_json_template_raw
    # )

    # # Create the prompt without using .format()
    # prompt_skills = PromptTemplate(
    #     input_variables=["product", "roles", "production_steps", "background_info"], 
    #     template=skills_template_str
    # )

    # # Chain for skills
    # skills_chain = LLMChain(llm=llm, prompt=prompt_skills)

    # # Define input variables for the chain
    # input_variables = {"product": product, "roles": roles_response, "production_steps": production_steps_response, "background_info": background_info}

    # # Get skills from OpenAI
    # skills_response = skills_chain.run(input_variables)
    # print("\nFähigkeiten:")
    # print(skills_response)

if __name__ == '__main__':
   main()