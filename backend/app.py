from flask import Flask, jsonify, request
from dotenv import load_dotenv
import os

# Create Flask app
app = Flask(__name__)

# Load environment variables
load_dotenv()

# Access environment variables
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")

# First simple route
@app.route('/')
def home():
    return 'Hello World!'

if __name__ == '__main__':
    app.run()
