"use client";
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

type Props = {
  pdf_url: string;
};

const PDFViewer = ({ pdf_url }: Props) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const retryLoad = () => {
    setLoading(true);
    setError(false);
  };

  useEffect(() => {
    const iframe = document.getElementById("pdf-iframe") as HTMLIFrameElement;

    const onLoadHandler = () => setLoading(false);
    const onErrorHandler = () => setError(true);

    iframe?.addEventListener("load", onLoadHandler);
    iframe?.addEventListener("error", onErrorHandler);

    return () => {
      iframe?.removeEventListener("load", onLoadHandler);
      iframe?.removeEventListener("error", onErrorHandler);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      {loading && !error && (
        <div className="absolute inset-0 flex justify-center items-center bg-white">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        </div>
      )}

      {error ? (
        <div className="flex flex-col justify-center items-center h-full">
          <p className="text-red-500">Failed to load the PDF.</p>
          <button
            onClick={retryLoad}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      ) : (
        <iframe
          id="pdf-iframe"
          src={`https://docs.google.com/gview?url=${pdf_url}&embedded=true&cacheBust=${Date.now()}`}
          className="w-full h-full"
          onLoad={() => setLoading(false)}
        ></iframe>
      )}
    </div>
  );
};

export default PDFViewer;
