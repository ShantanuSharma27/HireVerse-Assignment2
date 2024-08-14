import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter, BrowserRouter as Router } from 'react-router-dom';
import { ChakraProvider } from 
'@chakra-ui/react';
// Render the application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   
    <ChakraProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);