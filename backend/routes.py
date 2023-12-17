from flask import Flask, jsonify, request
from flask_cors import CORS
from backend.chains import run_production_steps_chain, run_roles_chain, run_skills_chain
from langchain.chat_models import ChatOpenAI
import dotenv
import os
import openai
import json
import pandas as pd

from backend.utils import read_file, read_json
from backend.dbextensions import db
from backend.dbmodels import Role, Competency

def init_routes(app):
    
    # Load environment variables
    dotenv.load_dotenv()
    openai.api_key = os.getenv("OPEN_AI_API_KEY")

    llm = ChatOpenAI(
        openai_api_key=openai.api_key, 
        model_name="gpt-3.5-turbo"
        )

    @app.route('/api/get-production-steps', methods=['POST'])
    def run_production():
        data = request.json
        product = data.get('product')
        result = run_production_steps_chain(llm, product)
        return jsonify(result)
    
    @app.route('/api/get-roles', methods=['POST'])
    def run_roles():
        data = request.json
        product = data.get('product')
        production_steps = data.get('production_steps')
        result = run_roles_chain(llm, product, production_steps)
        return jsonify(result)
    
    @app.route('/api/get-skills', methods=['POST'])
    def run_skills():
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400

        # Extract data from the JSON object
        product = data.get('product')
        production_steps = data.get('production_steps')
        roles = data.get('roles')

        # Load background information
        background_info_path = "backend/documents/background_info.txt"
        background_info = read_file(background_info_path)

        # Load the JSON-style template as a raw string
        json_template_path = "backend/documents/skills_json_description.json"
        json_template = read_json(json_template_path)

        if isinstance(json_template, dict):
            print("json_template is a valid dictionary")
        else:
            print("json_template is not a dictionary")

        result = run_skills_chain(llm, product, roles, production_steps, background_info, json_template)
        print(result)
        return jsonify(result)
    
    # Save competencies to database
    @app.route('/api/save-competencies', methods=['POST'])
    def save_competencies():

        try:
            data = request.get_json()

            for item in data:
                arbeitsschritt = item.get("Arbeitsschritt")
                rolle = item.get("Rolle")

                # Create an instance of YourModel and save the data
                new_data = Role(
                    Arbeitsschritt=arbeitsschritt,
                    Rolle=rolle,
                )

                kompetenzen = item.get("Kompetenzen", {})

                basiskompetenzen = ", ".join(kompetenzen.get("Basiskompetenzen", []))
                methodenkompetenzen = ", ".join(kompetenzen.get("Methodenkompetenzen", []))
                funktionalekompetenzen = ", ".join(kompetenzen.get("Funktionale Kompetenzen", []))
                softskills = ", ".join(kompetenzen.get("Soft Skills", []))

                # Add the instance to the SQLAlchemy session and commit the transaction
                db.session.add(new_data)
            
                db.session.commit()

                # Return a response indicating success
                return jsonify({"message": "JSON data processed and mapped to the database successfully"})

        except Exception as e:
            # Handle any errors that may occur during processing
            return jsonify({"error": str(e)}), 500

        

    return app