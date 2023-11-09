import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAI } from "langchain/llms/openai";
import { loadQAStuffChain } from "langchain/chains";
import { Document } from "langchain/document";
import { timeout } from "./config";

export const createPineconeIndex = async (
    client,
    indexName,
    vectorDimension 
) => {
    // Initiate index existence check
    console.log(`Creating index ${indexName}...`);

    // Get list of existing indexes
    const existingIndexes = await client.listIndexes();

    // Log existing indexes for inspection
    console.log("Existing Indexes:", existingIndexes);

    // Check for exact match of index name
    const indexExists = existingIndexes.some(existingIndex => existingIndex.name === indexName);

    if (!indexExists) {

    // If index does not exist, create it
    // if (!existingIndexes.includes(indexName)) {
        // Log index creation
        console.log(`Index ${indexName} does not exist. Creating...`);
        // Create index
        await client.createIndex({
            name: indexName,
            dimension: vectorDimension,
            metric: "cosine",
        });
        // Log successful index creation
        console.log(`Creating index... please wait for it to finish initializing.`);
        // Wait for index initializiation
        await new Promise((resolve) => setTimeout(resolve, timeout));
    } else {
        // Log if index already exists
        console.log(`Index ${indexName} already exists.`);
    }
}

// export const updatePinecone = async (client, indexName, docs) => {
//     // Retrieve Pinecone index
//     const index = client.Index(indexName);
//     // Log the retrieved index name
//     console.log(`Retrieved index: ${indexName}.`);

//     // Process each document in the docs array
//     for (const doc of docs) {
//         // Log document upload
//         console.log(`Uploading document ${doc.id}...`);

//         const txtPath = doc. metadata.source;
//         const text = doc.pageContent;

//         // Create RecursiveCharacterTextSplitter instance
//         const textSplitter = new RecursiveCharacterTextSplitter({
//             chunkSize: 1000,
//         });

//         // Log text splitting
//         console.log(`Splitting text into chunks...`);

//         // Split text into chunks
//         const chunks = await textSplitter.createDocuments([text]);
//         console.log(`Split text into ${chunks.length} chunks.`);
//         console.log(`Calling OpenAI's Embedding endpoint documents with ${chunks.length} chunks...`);

//         // Create OpenAI embeddings for documents
//         const embeddingsArrays = await new OpenAIEmbeddings().embedDocuments(
//             chunks.map((chunk) => chunk.pageContent.replace(/\n/g, " "))
//         );
//         console.log(`Creating ${chunks.length} vectors array with id, values, and metadata...`);

//         // Create and upload vectors in batches of 100
//         const batchSize = 100;
//         let batch:any = [];
//         for (let idx = 0; idx < chunks.length; idx++) {
//             const chunk = chunks[idx];
//             const vector = {
//                 id: `${txtPath}_${idx}`,
//                 values: embeddingsArrays[idx],
//                 metadata: {
//                     ...chunk.metadata,
//                     loc: JSON.stringify(chunk.metadata.loc),
//                     pageContent: chunk.pageContent,
//                     txtPath: txtPath
//                 },
//             }

//             // Add vector to the batch
//             batch.push(vector);

//             if (batch.length === batchSize || idx === chunks.length - 1) {
//                 console.log(`Uploading ${batch.length} vectors...`);

//                 // Check if batch has vectors before upsert
//                 if (batch.length > 0) {
//                     await index.upsert({ vectors: batch });
//                 }

//                 // Reset the batch
//                 batch = [];

//             // batch = [...batch, vector]

//             // // Upsert the vector if the batch is full or if it's the last item in the chunks array
//             // if (batch.length === batchSize || idx === chunks.length - 1) {
//             // console.log(`Uploading ${batch.length} vectors...`);

//             // await index.upsert({
//             //     vectors: batch,
//             // });
//             // // Empty the batch
//             // batch = [];
//         }
//         };
        

//     }

// }

export const updatePinecone = async (client, indexName, docs) => {
    const index = client.Index(indexName);
    console.log(`Retrieved index: ${indexName}.`);

    const batchSize = 100;
    let vectors: { id: string; values: number[]; metadata: { loc: string; pageContent: string; txtPath: string } }[] = [];

    for (const doc of docs) {
        const txtPath = String(doc.metadata.source); // Ensure txtPath is a string
        const text = doc.pageContent;

        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
        });

        const chunks = await textSplitter.createDocuments([text]);

        const embeddingsArrays = await new OpenAIEmbeddings().embedDocuments(
            chunks.map((chunk) => chunk.pageContent.replace(/\n/g, " "))
        );

        for (let idx = 0; idx < chunks.length; idx++) {
            const chunk = chunks[idx];
            const vector = {
                id: `${txtPath}_${idx}`,
                values: embeddingsArrays[idx],
                metadata: {
                    ...chunk.metadata,
                    loc: JSON.stringify(chunk.metadata.loc),
                    pageContent: chunk.pageContent,
                    txtPath: txtPath, // Ensure txtPath is a string value
                },
            };

             // Log the vector before pushing it into the array
            console.log('Vector:', vector);

            vectors.push(vector);

            if (vectors.length === batchSize || idx === chunks.length - 1) {
                console.log(`Uploading ${vectors.length} vectors...`);

                await index.upsert(vectors);

                vectors = []; // Clear the vectors array
            }
        }
    }
};



export const queryPineconeVectorStoreAndQueryLLMS = async (
    client,
    indexName,
    question
) => {
    // Log start query process
    console.log(`Querying Pinecone vector store...`);

    // Retrieve Pinecone index
    const index = client.Index(indexName);

    // Create query embedding
    const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question);

    // Query Pinecone index and return top 10 matches
    let queryResponse = await index.query({
            topK: 10,
            vector: queryEmbedding,
            includeMetadata: true,
            includeValues: true,
    });
    // Log number of matches
    console.log(`Found ${queryResponse.results.length} matches.`);

    // Log the question being asked
    console.log(`Asking question: ${question}`);
    if (queryResponse.matches.length) {
        // Create an OpenAI instance and load the QAStuffChain
        const openai = new OpenAI({});
        const chain = await loadQAStuffChain(openai);

        // Extract and concatenate page content from matched documents
        const concatenatedPageContent = queryResponse.matches
            .map((match) => match.metadata.pageContent)
            .join(" ");

        const result = await chain.call({
            input_documents: [new Document({ pageContent: concatenatedPageContent})],
            question: question,
        });

        // Log answer
        console.log(`Answer: ${result.answer}`);
        return result.text;
    } else {
        // Log if no matches are found
        console.log(`No matches found.`);
        return "No matches found. No query to ChatGPT.";
    }
}