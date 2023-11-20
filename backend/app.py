from flask import Flask, app, jsonify
from flask_cors import CORS
from langchain.prompts import PromptTemplate
from langchain.chat_models import ChatOpenAI
from langchain.chains import LLMChain
from pathlib import Path
import dotenv
import os
import openai
import json
import sys

# print ls
sys.path.append(os.getcwd())

from backend.chains import run_production_steps_chain, run_roles_chain, run_skills_chain
from backend.utils import read_file, validate_steps
from backend.routes import create_app

app = create_app()

def main():

    # Load environment variables
    dotenv.load_dotenv()
    openai.api_key = os.getenv("OPEN_AI_API_KEY")

    llm = ChatOpenAI(
        openai_api_key=openai.api_key, 
        model_name="gpt-3.5-turbo"
        )
    
    # 1. Ask about product
    product = input("Welches Produkt wird in dem Werk produziert? ")

    # 2. Production steps
    production_steps_response = run_production_steps_chain(llm, product)
    validated_production_steps = validate_steps(production_steps_response, "Produktionsschritte")

    # 3. Roles
    roles_response = run_roles_chain(llm, product, validated_production_steps)
    validated_roles = validate_steps(roles_response, "Rollen")

    # 4. Skills
    # Load background information
    background_info_path = "backend/documents/background_info.txt"
    background_info = read_file(background_info_path)

    # Load the JSON-style template as a raw string
    skills_json_template_path = "backend/documents/skills_json_description.txt"
    skills_json_template = read_file(skills_json_template_path)

    skills_response = run_skills_chain(llm, product, validated_roles, validated_production_steps, background_info, skills_json_template)
    validate_steps(skills_response, "Fähigkeiten")

    print(skills_response)

if __name__ == '__main__':
   app.run(debug=True, port=8080)