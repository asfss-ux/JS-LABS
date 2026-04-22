const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Moje API Autorów',
    description: 'Automatycznie wygenerowana dokumentacja'
  },
  host: 'localhost:2001'
};

const outputFile = './swagger.json'; 
const routes = ['./server.js']; 

swaggerAutogen(outputFile, routes, doc);