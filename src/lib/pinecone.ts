import { Pinecone } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
// import {} from "langchain/document_loaders/fs/pdf";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
let pinecone: Pinecone | null = null;
export const getPinecone = async () => {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }
  return pinecone;
};

export async function loadS3IntoPinecone(fileKey: string) {
  //1. Obtain the pdf => download and read from pdf
  console.log("Downloading s3 into the file system");
  const file_name = await downloadFromS3(fileKey);
  if (!file_name) {
    throw new Error("Could not download from S3");
  }
  const loader = new PDFLoader(file_name);
  const pages = await loader.load(); //Method that reads the buffer contents and metadata based on the type of filePathOrBlob, and then calls the parse() method to parse the buffer and return the documents.
  return pages;
}
