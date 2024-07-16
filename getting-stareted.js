import { ChromaClient, DefaultEmbeddingFunction } from 'chromadb';

const chromadbCollectionName = 'my_collection';

const client = new ChromaClient({
  // chroma server expected to be running on this address.
  // chromadb server can be run using docker as follows:
  // docker pull chromadb/chroma
  // docker run -p 8000:8000 chromadb/chroma
  path: 'http://localhost:8000',
});

const gettingStarted = async () => {
  const collection = await client.createCollection({
    name: chromadbCollectionName,
  });

  await collection.add({
    documents: [
      'This is a document about pineapple',
      'This is a document about oranges',
    ],
    ids: ['id1', 'id2'],
  });

  const results = await collection.query({
    queryTexts: ['This is a query document about hawaii'], // Chroma will embed this for you
    nResults: 2, // how many results to return
  });

  console.log(results);
};

const addDocument = async (document) => {
  const collection = await client.getCollection({
    name: chromadbCollectionName,
    embeddingFunction: new DefaultEmbeddingFunction(),
  });

  const count = await collection.count();

  await collection.add({
    documents: [document],
    ids: [`id${count + 1}`],
  });

  const peeked = await collection.peek();
  console.log(peeked);
};

const queryDocuments = async (query) => {
  const collection = await client.getCollection({
    name: chromadbCollectionName,
    embeddingFunction: new DefaultEmbeddingFunction(),
  });

  const results = await collection.query({
    queryTexts: [query],
    nResults: 2,
  });

  return results;
};

const peekDocuments = async () => {
  const collection = await client.getCollection({
    name: chromadbCollectionName,
    embeddingFunction: new DefaultEmbeddingFunction(),
  });

  const peeked = await collection.peek();
  console.log(peeked);
};

const isGettingStarted = async () => {
  const result = await client.listCollections();
  return (
    result.filter((collection) => collection.name === chromadbCollectionName)
      .length === 1
  );
};

const main = async () => {
  if (await isGettingStarted()) {
    console.log('Already done getting started');
  } else {
    console.log('Getting started with ChromaDB');
    gettingStarted();
    addDocument('This is a document abount mikan');
    addDocument('This is a document abount apple');
    addDocument('This is a document abount strawberry');
    addDocument('This is a document abount beef');
  }

  const queryResult = await queryDocuments('hawaii');
  console.log(queryResult);

  // Get brief information of the collection
  // peekDocuments();
};

main();
