import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  //search through top 5 matching embeddinsg from pinecone
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
  const index = pinecone.Index("summarize-my-pdf");
  try {
    const namespace = index.namespace(convertToAscii(fileKey));
    const queryResult = await namespace.query({
      topK: 5,
      includeMetadata: true,
      vector: embeddings,
    });

    return queryResult.matches || [];
  } catch (error) {
    console.log("Error querying embedding", error);
    throw error;
  }
}

export async function getContext(query: string, fileKey: string) {
  const queryEmbeddings = await getEmbeddings(query);
  const matches = getMatchesFromEmbeddings(queryEmbeddings, fileKey);
  const qualifyingDocs = (await matches).filter(
    (match) => match.score && match.score > 0.7
  );
  type Metadata = {
    text: string;
    pageNumber: number;
  };

  const docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);
  // console.log(`docs ${docs}`);

  return docs.join("\n").substring(0, 3000); //so that we dont send all the data to openai because toen limit might exceed
}
