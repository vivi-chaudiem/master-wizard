from flask import jsonify
from backend.pinecone.pinecone_service import PineconeService
from langchain.document_loaders import PyPDFLoader


def setup_pinecone(client: PineconeService, index_name: str):
    loader = PyPDFLoader('backend/documents', {".pdf": lambda path: PyPDFLoader(path)})

    docs = loader.load()
    vector_dimensions = 1536

    try:
        client.create_index(index_name, vector_dimensions, "cosine")
        client.upsert_vectors(index_name, docs)
    except Exception as e:
        print(e)
        return jsonify({'data': 'Error while creating index or uploading data to Pinecone...'}), 500

    return jsonify({'data': 'Successfully created index and loaded data into Pinecone...'})