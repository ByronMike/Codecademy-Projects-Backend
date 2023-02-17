1. Créer un fichier package.json :
   {
   "name": "node-api-postgres",
   "version": "1.0.0",
   "description": "RESTful API with Node.js, Express, and PostgreSQL",
   "main": "index.js",
   "license": "MIT"
   }
2. yarn add express pg
3. Create an index.js file => test fonctionnement (Terminal => node index.js)
4. Go to http://localhost:3000
5. Connecting to a Postgres DB using a Client :
   5.1 Create a file called queries.js (to create a pool of connections, therefore, we don’t have to open and close a client each time we make a query). Les informations L1-L8 doivent être stockées dans un fichier env séparé en production !
   5.2 Import functions from queries.js to index.js with : const db = require("./queries");
6. Use Thunder Client to test our routes
   6.1 GET http://localhost:3000/users , http://localhost:3000/users/1
   6.2 POST (via Body) http://localhost:3000/users/ => name : "nemo" , "email" : "nemo@abc.com
