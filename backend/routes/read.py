from flask import request, jsonify
from pinecone.pinecone_service import PineconeService

def setup_read_routes(app, pinecone_api_key, pinecone_env, pinecone_index_name):

    @app.route('/query_pinecone', methods=['POST'])
    def query_pinecone():
        # Get the request body data
        body = request.get_json()

        # Get the question from the request body data
        question = body['question']

        # Query the Pinecone index
        pinecone_service = PineconeService(pinecone_api_key, pinecone_env)
        response = pinecone_service.query_index(pinecone_index_name, question)

        # Create a response object
        response_obj = jsonify(response)

        # Set CORS headers to allow requests from 'http://localhost:3000'
        response_obj.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        response_obj.headers['Access-Control-Allow-Methods'] = 'POST'
        response_obj.headers['Access-Control-Allow-Headers'] = 'Content-Type'

        return response_obj