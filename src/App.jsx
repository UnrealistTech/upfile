import './server';
import React, { useState } from 'react'
import { encode as blockEncode} from 'multiformats/block';
import { CarWriter } from '@ipld/car';
import { CID } from 'multiformats/cid';
import * as json from 'multiformats/codecs/json';
import { sha256 } from 'multiformats/hashes/sha2';
import './App.css';
import 'fs';

function App() {
  const [carFile, setCarFile] = useState(''); // Assuming you want to store the CAR file path

  async function convertToCAR(file) {
    let writer;
    let out;
    
    try {
      const {writer: carWriter, out: carOut} = await CarWriter.create();
      writer = carWriter;
      out = carOut;
      async (data) => {
      // Implement logic to write data to your desired destination (e.g., console, local storage)
      localStorage.setItem('carData', JSON.stringify(data));
      console.log("Writing data to CAR:", data); 
     },
      
      async () => {
      // // Implement logic to handle flushing the stream if needed (optional)
      localStorage.removeItem('carData');
      console.log("Flushing CAR writer"); // Replace with your implementation (optional)
     };
      // Read the file content
      const reader = new FileReader();
      const data = await new Promise((resolve, reject) => {
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
  
      // Define block size (adjust based on your needs)
      const blockSize = 1024; // 1 KB blocks
  
      // Split data into blocks
      const blocks = [];
      for (let i = 0; i < data.byteLength; i += blockSize) {
        const block = data.slice(i, Math.min(i + blockSize, data.byteLength));
        blocks.push(block);
      }
      console.log("Block Data:", blocks);
      
      const encodedData = json.encode({ blocks });
      console.log("Encoded Data:", encodedData);
      
      const hash = await sha256.digest(encodedData);
      console.log("Hash:", hash);
      
      const cid = CID.create(1, json.code, hash);
      console.log("Block CID:", cid.toString());

      const block = {
        cid,
        data: encodedData,
      };
      console.log("Block:", block);
      
      const car = json.encode({
        roots: block,
      });
      console.log("CAR:", car);
      console.log("Writer state:", writer);


    } catch (error) {
      console.error("Error converting file to CAR:", error);
    } finally {
      console.log("Writer state again:", writer);
/*       if (writer) {
        try {
          await writer.close();
          console.log("Writer has been successfully closed."); // Verification log
        } catch (error) {
          console.error("Error closing the writer:", error);
        }
 */
        const roots = await out[Symbol.asyncIterator]().next();
        const carNew = roots.value;
        console.log("carNew:", carNew);
  
        const carFileName = 'sample.car'; // Name of the file to download

        // Convert the binary data to a Blob
        const blob = new Blob([carNew], { type: 'application/octet-stream' });

        // Create a URL for the Blob
        const url = window.URL.createObjectURL(blob);

        // Create a temporary anchor element and trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = carFileName;
        document.body.appendChild(a); // Append the anchor to the body
        a.click(); // Simulate a click on the anchor to trigger the download

        // Clean up by revoking the Blob URL and removing the anchor element
        // window.URL.revokeObjectURL(url);
        // document.body.removeChild(a);

        // Update the state to reflect the file has been prepared for download
        setCarFile(carFileName);
        console.log("CAR file path:", carFileName);

        return carNew;
      }
    }
  
  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      convertToCAR(file);
    }
  }

  return (
    <>
      <div>
        <input type="file" onChange={handleFileChange} />
        {carFile && <a href={`file://${carFile}`} download>Download CAR File</a>}
      </div>
      <h1>upFile</h1>
      <div className="card">
        <p>This is also silly</p>
      </div>
    </>
  );
}

export default App;