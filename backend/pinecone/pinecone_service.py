import pinecone
import json
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.chains.question_answering import load_qa_chain
from langchain.llms import OpenAI


class PineconeService:

    # Initialize Pinecone API client with key and environment
    def __init__(self, key, env):
        pinecone.init(api_key=key, environment=env)

    # Create a Pinecone index
    async def create_index(self, index_name, dimension, metric):
        indexes = self.list_indexes()

        # Only create new index if it does not exist yet
        if index_name not in indexes:
            await self.create_index(name=index_name, dimension=dimension, metric=metric)
            print(f"Created index {index_name}.")
        else:
            print(f"Index {index_name} already exists. No creation of a new index.")

    # Upsert vectors from a PDF to a Pinecone index
    async def upsert_vectors_from_pdf(self, index_name, docs):
        index = self.Index(index_name)
        print(f"Retrieved index: {index_name}")

        vectors = []
        batch_size = 100

        for doc in docs:
            txt_path = str(doc['metadata']['source'])  # Ensure txtPath is a string
            text = doc['pageContent']

            text_splitter = RecursiveCharacterTextSplitter(chunkSize=1000)
            chunks = await text_splitter.create_documents([text])

            embeddings = await OpenAIEmbeddings().embed_documents([
                chunk['pageContent'].replace("\n", " ") for chunk in chunks
            ])

        for idx, chunk in enumerate(chunks):
            vector = {
                'id': f"{txt_path}_{idx}",
                'values': embeddings[idx],
                'metadata': {
                    **chunk['metadata'],
                    'loc': json.dumps(chunk['metadata']['loc']),
                    'pageContent': chunk['pageContent'],
                    'txtPath': txt_path,
                }
            }

            vectors.append(vector)

            if len(vectors) == batch_size or idx == len(chunks) - 1:
                print(f"Uploading {len(vectors)} vectors...")
                await index.upsert(vectors)
                vectors = []  # Clear the vectors array

    # Query a Pinecone index
    async def query_index(self, index_name, question):
        print("Querying Pinecone vector store...")

        index = self.Index(index_name)

        query_embedding = OpenAIEmbeddings().embed_query(question)

        query_response = index.query(
            top_k=10,
            vector=query_embedding,
            include_metadata=True,
            include_values=True
        )

        print(f"Found {len(query_response.results)} matches.")

        print(f"Asking question: {question}")

        if query_response.matches:
            openai = OpenAI({})
            chain = await load_qa_chain(openai)

            concatenated_page_content = ' '.join(match['metadata']['pageContent'] for match in query_response.matches)

            result = await chain.call(
                input_documents=[{'pageContent': concatenated_page_content}],
                question=question
            )

            print(f"Answer: {result['answer']}")
            return result['text']
        else:
            return "No matches found. No query to ChatGPT."