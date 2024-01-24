from flask import Flask, jsonify, request
from flask_cors import CORS
from chains import run_production_steps_chain, run_roles_chain, run_skills_chain
from langchain.chat_models import ChatOpenAI
from langchain.document_loaders import TextLoader
import dotenv
import os
import openai

from utils import read_file, read_json
from dbextensions import db
from dbmodels import Role, Competency

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
        # Load the JSON-style template as a raw string
        json_template_path = "backend/documents/roles_json_description.json"
        json_template = read_json(json_template_path)

        data = request.json
        product = data.get('product')
        production_steps = data.get('production_steps')
        result = run_roles_chain(llm, product, production_steps, json_template)
        return jsonify(result)
    
    @app.route('/api/get-skills', methods=['POST'])
    def run_skills():
        data = request.get_json()

        print("DATA aus run_skills", data)

        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400

        # Extract data from the JSON object
        product = data.get('product')
        steps_and_roles_string = data.get('steps_and_roles_string')
        escaped_steps_and_roles_string = steps_and_roles_string.replace("{", "{{").replace("}", "}}")

        # Load background information
        loader = TextLoader("backend/documents/background_info.txt")
        documents = loader.load()
        background_info = documents[0].page_content

        # Load the JSON-style template as a raw string
        json_template_path = "backend/documents/skills_json_description.json"
        json_template = read_json(json_template_path)

        result = run_skills_chain(llm, product, escaped_steps_and_roles_string, background_info, json_template)
        print(result)
        return jsonify(result)
    
    # Save competencies to database
    @app.route('/api/save-competencies', methods=['POST'])
    def save_competencies():

        try:
            data = request.get_json()
            print(data)

            for item in data:
                arbeitsschritt = item.get("Arbeitsschritt")
                rolle = item.get("Rolle")

                # Check if the combination already exists in the database
                existing_role = Role.query.filter_by(arbeitsschritt=arbeitsschritt, bezeichnung=rolle).first()

                if existing_role:
                    # Use the existing role's ID
                    role_id = existing_role.id
                else:
                    # Create a new role if it doesn't exist
                    new_role = Role(
                        arbeitsschritt=arbeitsschritt,
                        bezeichnung=rolle,
                    )
                    db.session.add(new_role)
                    db.session.flush()
                    role_id = new_role.id

                for kompetenz_typ, kompetenzen in item.get("Kompetenzen", {}).items():
                    for kompetenz in kompetenzen:
                        if isinstance(kompetenz, dict):
                            bezeichnung = kompetenz.get("bezeichnung")
                            maxlevel = kompetenz.get("maxlevel")
                            targetlevel = kompetenz.get("targetlevel")
                        else:
                            print("Kompetenz is not a dictionary")

                        new_competency = Competency(
                            kompetenz_typ=kompetenz_typ,
                            bezeichnung=bezeichnung,
                            max_level=maxlevel,
                            soll_level=targetlevel,
                            rolle_id=role_id  # Use the role_id obtained earlier
                        )
                        db.session.add(new_competency)
            
            db.session.commit()
            return jsonify({"message": "Daten erfolgreich gespeichert."}), 201
            
        except KeyError as e:
            return jsonify({"Fehler": f"Fehlende Daten: {str(e)}"}), 400

        except Exception as e:
            # Handle any errors that may occur during processing
            print(f"An error occurred: {e}")  # Log the error for debugging
            return jsonify({"Fehler": str(e)}), 500

    return app