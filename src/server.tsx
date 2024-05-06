// server.tsx

// Import the required libraries
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import 'fs';
import React, { useState } from 'react';
import { encode as blockEncode} from 'multiformats/block';
import { CarWriter } from '@ipld/car';
import { CID } from 'multiformats/cid';
import * as json from 'multiformats/codecs/json';
import { sha256 } from 'multiformats/hashes/sha2';
import './App.css';


// Your server-side rendering code goes here

// Example: Render a React component to a string
const App = () => {
  return (
    <div>
      <h1>Hello, Server-Side Rendering!</h1>
    </div>
  );
};
const html = ReactDOMServer.renderToString(<App />);

// Output the rendered HTML to the console
console.log(html);