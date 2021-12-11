const dotenv = require('dotenv');
//read env variables from config.env and then save them to node.js environment varibale
dotenv.config({ path: './config.env' });
const app = require('./app');
//this will be ther starting file
//we should have 2 separate files for express and server
//console.log(process.env);
//:STARTING THE SERVER
const port = 3000 || process.env.port;
app.listen(port, () => {
  console.log(`app running on port ${port} ...`);
});
