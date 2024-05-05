import React, { useState } from 'react'
import fs from 'fs'
import './App.css'
/* import { CarWriter } from '@ipld/car/writer'
import { CID } from 'multiformats/cid'
import * as raw from 'multiformats/codecs/raw'
import { sha256 } from 'multiformats/hashes/sha2'
import { base64 } from 'multiformats/bases/base64'
import { Readable } from'stream' */
import { fileURLToPath } from 'url'
import { path } from 'path'
import { CarWriter, CarCIDIterator } from '@ipld/car';
import { encode } from 'multiformats/block';
import { readFile } from 'fs/promises'; // Using promises for async file reading

function App() {
  
  async function convertToCAR(csvPath) {
    try {
      // Read the CSV file content
      const csvData = await readFile(csvPath, 'utf-8');
  
      // Create an encoder for raw data (adjust if needed for specific CSV format)
      const encoder = new encode({ type: 'text' }); // Adjust 'type' to the appropriate format
  
      // Encode the CSV data
      const encodedData = await encoder.encode(csvData);
  
      // Create the CAR object
      const car = await CarWriter.encode(encodedData);
  
      // (Optional) Use the CAR object for further processing or storage
  
      console.log("CAR CID:", car.root.get('hash'));
      return car;
  
    } catch (error) {
      console.error("Error converting CSV to CAR:", error);
    }
  }
  
  if (csvFile) {
    const csvFilePath = path.fromFileUrl(csvFile); // Convert file URL to file path
    convertToCAR(csvFilePath).then((car) => { 
    });
  }

  return (
    <>
      <div>
        <input type="file" onChange={handleFileChange} />
        {/* display the new file name here */}
        /* allow the user to download the CAR file */
        <a href={csvFile} download>Download CAR File</a>
      </div>
      <h1>upFile</h1>
      <div className="card">
        <p>This is also silly</p>
      </div>
    </>
  )
}

export default App