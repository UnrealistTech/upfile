import React, { useState } from 'react'
import fs from 'fs'
import './App.css'
import { CarWriter } from '@ipld/car/writer'
import { CID } from 'multiformats/cid'
import * as raw from 'multiformats/codecs/raw'
import { sha256 } from 'multiformats/hashes/sha2'
import { base64 } from 'multiformats/bases/base64'
import { Readable } from'stream'

function App() {
  const [carFile, setCarFile] = useState(null)

  const carCreator = async (file) => {
    try {
      const car = await CarWriter.create([])
      if (!car) {
        console.error('Error creating CAR object: car is undefined');
        return null;
      }
      console.log('CAR object created:', car); // Log the car object
  
     const reader = file.stream().getReader() 
     let offset = 0
     let cid = null
       
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        if (value) {
        const bytes = raw.encode(value)
          const hash = await sha256.digest(bytes)
          const cid = CID.create(1, raw.code, hash)
          console.log('CID: ' + cid.toString())
         }
      } 
      const { writer, out } = await CarWriter.create([cid])
      Readable.from(out).pipe(fs.createWriteStream('example.car'))
    
      // store a new block, creates a new file entry in the CAR archive
      await writer.put({ cid, bytes })
      await writer.close()
    
      const inStream = fs.createReadStream('example.car')
      // read and parse the entire stream in one go, this will cache the contents of
      // the car in memory so is not suitable for large files.
      const reader2 = new CarReader() // Instantiate the CarReader class
      reader2.from(inStream) // Call the from method on the instantiated CarReader object
      // read the list of roots from the header
      const roots = await reader2.getRoots()
      // retrieve a block, as a { cid:CID, bytes:UInt8Array } pair from the archive
      const got = await reader2.get(roots[0])
      // also possible: for await (const { cid, bytes } of CarIterator.fromIterable(inStream)) { ... }

      return car
    } catch (error) {
      console.error('Error converting file to CAR:', error)
      throw error
    }
  }


  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    try {
      const car = await carCreator(file);
      /* if (!car) {
        console.error('CAR object is undefined');
        return;
      }
      if (!car.blocks) {
        console.error('CAR blocks are undefined');
        return;
      }
      if (car.blocks.length === 0) {
        console.error('CAR blocks are empty');
        return;
      } */
      
      const cid = car.blocks[0].cid.toString(); // Access the CID from the car object
      setCarFile(cid); // Set carFile with the CID value
    } catch (error) {
      console.error('Error converting file to CAR:', error);
    }
  }

  return (
    <>
      <div>
        <input type="file" onChange={handleFileChange} />
        {/* display the new file name here */}
        <a href={carFile} download>Download CAR File</a>
      </div>
      <h1>upFile</h1>
      <div className="card">
        <p>This is also silly</p>
      </div>
    </>
  )
}

export default App