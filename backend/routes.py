from flask import Flask, jsonify
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app, origins='*')

    @app.route('/api/home', methods=['GET'])
    def home():
        return jsonify({"message": "Welcome to the LangChain API!"})

    return app