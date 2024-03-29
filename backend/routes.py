from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from flask_httpauth import HTTPBasicAuth
from werkzeug.security import generate_password_hash, check_password_hash
from chains import run_production_steps_chain, run_roles_chain, run_skills_chain
from langchain.chat_models import ChatOpenAI
from langchain.document_loaders import TextLoader
import dotenv
import os
import openai
import json
import re
import time

from utils import read_json
from dbextensions import db
from dbmodels import Role, Competency

def init_routes(app):
    
    # Load environment variables
    dotenv.load_dotenv()
    openai.api_key = os.getenv("OPEN_AI_API_KEY")

    # Set up OpenAI API
    llm = ChatOpenAI(
        openai_api_key=openai.api_key, 
        model_name="gpt-3.5-turbo-0125"
        )

    # Set up basic authentication
    auth = HTTPBasicAuth()
    users = {
        os.getenv("BACKEND_USERNAME"): generate_password_hash(os.getenv("BACKEND_PASSWORD"))
    }

    @auth.verify_password
    def verify_password(username, password):
        print(f"Received username: {username}")
        print(f"Received password: {password}")

        if username in users and \
                check_password_hash(users.get(username), password):
            return username

    # Routes
    @app.route('/api/get-production-steps', methods=['POST'])
    @auth.login_required
    def run_production():
        data = request.json
        product = data.get('product')
        additionalCompanyInfo = data.get('additionalCompanyInfo')
        additionalProductInfo = data.get('additionalProductInfo')
        result = run_production_steps_chain(llm, product, additionalCompanyInfo, additionalProductInfo)
        print("Prompt Resultat:", result)

        # Cut off the result off to only get the numerated list
        pattern = re.compile(r'^\d+\..*$', re.MULTILINE)
        matches = pattern.findall(result)
        numerated_list = '\n'.join(matches)
        print("Numerierte Liste:", numerated_list)
        return jsonify(numerated_list)
    
    @app.route('/api/get-roles', methods=['POST'])
    @auth.login_required
    def run_roles():
        # Load the JSON-style template as a raw string
        json_template_path = "documents/roles_json_description.json"
        json_template = read_json(json_template_path)

        data = request.json
        product = data.get('product')
        production_steps = data.get('production_steps')
        additionalCompanyInfo = data.get('additionalCompanyInfo')
        additionalProductInfo = data.get('additionalProductInfo')
        additionalRolesInfo = data.get('additionalRolesInfo')
        result = run_roles_chain(llm, product, production_steps, json_template, additionalCompanyInfo, additionalProductInfo, additionalRolesInfo)
        return jsonify(result)
    
    @app.route('/api/get-skills', methods=['POST'])
    @auth.login_required
    def run_skills():
        data = request.get_json()

        print("Raw data:", request.data)  # Log raw request data
        print("JSON data:", data)

        print("DATA aus run_skills", data)

        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400

        # Extract data from the JSON object
        product = data.get('product')
        steps_and_roles_string = data.get('steps_and_roles_string')
        escaped_steps_and_roles_string = steps_and_roles_string.replace("{", "{{").replace("}", "}}")

        # Load background information
        loader = TextLoader("documents/background_info.txt")
        documents = loader.load()
        background_info = documents[0].page_content

        # Load the JSON-style template as a raw string
        json_template_path = "documents/skills_json_description.json"
        json_template = read_json(json_template_path)

        result = run_skills_chain(llm, product, escaped_steps_and_roles_string, background_info, json_template)

        if result and "Skills" in result:
            time.sleep(3) # Make sure that the rest loads as well
            valid_json = extract_valid_json(result)
        else:
            time.sleep(5)
            result = run_skills_chain(llm, product, escaped_steps_and_roles_string, background_info, json_template)

        if valid_json is not None:
            print("Extracted valid JSON:", valid_json)
            return jsonify(valid_json), 200  # Directly use jsonify for Python dict or list
        else:
            print("No valid JSON found")
            print("Received result: ", result)
            return jsonify({'error': 'Failed to extract valid JSON from the result'}), 400

        # response = make_response(jsonify(result))
        # response.headers['Content-Type'] = 'application/json; charset=utf-8'
        
    # Save competencies to database
    @app.route('/api/save-competencies', methods=['POST'])
    @auth.login_required
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
        
def find_json_boundaries(s):
    open_chars = {'{': '}', '[': ']'}
    close_chars = {v: k for k, v in open_chars.items()}
    stack = []
    start_index = -1

    for i, char in enumerate(s):
        if char in open_chars:
            stack.append(char)
            if start_index == -1:
                start_index = i
        elif char in close_chars and stack:
            if stack[-1] == close_chars[char]:
                stack.pop()
                if not stack:
                    return start_index, i + 1
            else:
                # Mismatched closing character
                break
    return None

def extract_valid_json(s):
    boundaries = find_json_boundaries(s)
    if boundaries:
        json_str = s[boundaries[0]:boundaries[1]]
        try:
            return json.loads(json_str)
        except json.JSONDecodeError:
            pass
    return None