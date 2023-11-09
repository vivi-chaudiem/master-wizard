from flask import Flask, Request
from dotenv import load_dotenv
from routes.read import setup_read_routes
import os

# Create Flask app
app = Flask(__name__)

# Load environment variables
load_dotenv()

# Access the environment variables
pinecone_api_key = os.getenv("PINECONE_API_KEY")
pinecone_env = os.getenv("PINECONE_ENVIRONMENT")
pinecone_index_name = os.getenv("PINECONE_INDEX_NAME")

# Set up your routes by passing the Flask app instance
setup_read_routes(app, pinecone_api_key, pinecone_env, pinecone_index_name)

if __name__ == '__main__':
    app.run()