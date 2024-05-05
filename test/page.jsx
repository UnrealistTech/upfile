import React from 'react'
import fs from 'fs'
import { Readable } from 'stream'
import { CarReader, CarWriter } from '@ipld/car'
import * as raw from 'multiformats/codecs/raw'
import { CID } from 'multiformats/cid'
import { sha256 } from 'multiformats/hashes/sha2'

async function example() {
  const bytes = new TextEncoder().encode('random meaningless bytes')
  const hash = await sha256.digest(raw.encode(bytes))
  const cid = CID.create(1, raw.code, hash)

  // create the writer and set the header with a single root
  const { writer, out } = await CarWriter.create([cid])
  Readable.from(out).pipe(fs.createWriteStream('example.car'))

  // store a new block, creates a new file entry in the CAR archive
  await writer.put({ cid, bytes })
  await writer.close()

  const inStream = fs.createReadStream('example.car')
  // read and parse the entire stream in one go, this will cache the contents of
  // the car in memory so is not suitable for large files.
  const reader = new CarReader() // Instantiate the CarReader class
  reader.from(inStream) // Call the from method on the instantiated CarReader object
  // read the list of roots from the header
  const roots = await reader.getRoots()
  // retrieve a block, as a { cid:CID, bytes:UInt8Array } pair from the archive
  const got = await reader.get(roots[0])
  // also possible: for await (const { cid, bytes } of CarIterator.fromIterable(inStream)) { ... }

  console.log(
    'Retrieved [%s] from example.car with CID [%s]',
    new TextDecoder().decode(got.bytes),
    roots[0].toString()
  )
}

example().catch((err) => {

})
