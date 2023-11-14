from flask import Flask, Request, jsonify
from dotenv import load_dotenv
from routes.read import setup_read_routes
from flask_cors import CORS
import os

# Create Flask app
app = Flask(__name__)

# Load environment variables
load_dotenv()

# Access the environment variables
pinecone_api_key = os.getenv("PINECONE_API_KEY")
pinecone_env = os.getenv("PINECONE_ENVIRONMENT")
pinecone_index_name = os.getenv("PINECONE_INDEX_NAME")

# Enable CORS for all routes
CORS(app, origins=["http://localhost:3000"])  # This enables CORS for all routes in your app

# Set up your routes by passing the Flask app instance
setup_read_routes(app, pinecone_api_key, pinecone_env, pinecone_index_name)

# Uncomment the following lines to enable CORS headers
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    response.headers['Access-Control-Allow-Methods'] = 'POST'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

if __name__ == '__main__':
    app.run()