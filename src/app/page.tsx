'use client'

import React, { useState } from 'react';
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function Home() {


  const [file, setFile] = useState<Blob | null>(null);
  const [text, setText] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
      extractText(selectedFile);
    }
  };

  const extractText = async (file: Blob) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const arrayBuffer = reader.result;
      if (arrayBuffer) {
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let extractedText = '';

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          const page = await pdf.getPage(pageNumber);
          const content = await page.getTextContent();
          const pageText = content.items.map((item: any) => item.str).join(' ');
          extractedText += pageText + '\n';
        }
        setText(extractedText);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <main className="p-8">

      <div className="max-w-5xl flex flex-col gap-4">
        <input type="file" onChange={handleFileChange} accept="application/pdf" className="border border-gray-200 rounded p-4 w-fit" />

        {text && (
          <div className="border border-gray-200 rounded p-4">
            <p className="whitespace-pre-wrap">{text}</p>
          </div>
        )}
      </div>
    </main>
  );
}