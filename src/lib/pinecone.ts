import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import md5 from "md5";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { getEmbeddings } from "./embeddings";
import { convertToAscii } from "./utils";
let pinecone: Pinecone | null = null;
export const getPineconeClient = async () => {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }
  return pinecone;
};
type PDFPage = {
  //got this from logging the page in console
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};
export async function loadS3IntoPinecone(fileKey: string) {
  //1. Obtain the pdf => download and read from pdf
  console.log("Downloading s3 into the file system");
  const file_name = await downloadFromS3(fileKey);
  if (!file_name) {
    throw new Error("Could not download from S3");
  }
  console.log("loading pdf into memory" + file_name);
  const loader = new PDFLoader(file_name);
  const pages = (await loader.load()) as PDFPage[]; //Method that reads the buffer contents and metadata based on the type of filePathOrBlob, and then calls the parse() method to parse the buffer and return the documents.

  //2. Split and segement the pdf
  const documents = await Promise.all(pages.map(prepareDocument));

  //3. Vectorise and embed individual documents
  const vectors = await Promise.all(documents.flat().map(embedDocument));

  //4. Upload to pinecone
  const client = await getPineconeClient();
  const pineconeIndex = client.Index("summarize-my-pdf");
  console.log("Inserting vectors into Pinecone");
  const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
  console.log("inserting vectors into pinecone");
  await namespace.upsert(vectors);

  return documents[0];
}

async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (error) {
    console.log(`Error embedding document`, error);
    throw error;
  }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  //since text can get too big in prepareDocument for pinecone to handle, this function came into existence
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

async function prepareDocument(page: PDFPage) {
  //we dont want split a pdf into pages and then vectorize them, ineffcient and bad
  //we need to split the pdf in even smaller units so each and every page will be split
  let { metadata, pageContent } = page;
  pageContent = pageContent.replace(/\n/g, "");
  // split the docs
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);
  return docs;
}
