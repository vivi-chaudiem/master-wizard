from flask import Flask, jsonify, request
from flask_cors import CORS
from backend.chains import run_production_steps_chain, run_roles_chain, run_skills_chain
from langchain.chat_models import ChatOpenAI
import dotenv
import os
import openai

from backend.utils import read_file

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

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
        data = request.json
        product = data.get('product')
        production_steps = data.get('production_steps')
        roles = data.get('roles')

        # Load background information
        background_info_path = "backend/documents/background_info.txt"
        background_info = read_file(background_info_path)

        # Load the JSON-style template as a raw string
        json_template_path = "backend/documents/skills_json_description.txt"
        json_template = read_file(json_template_path)

        result = run_skills_chain(llm, product, roles, production_steps, background_info, json_template)
        return jsonify(result)

    return app