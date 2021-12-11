const mongoose = require('mongoose');
const dotenv = require('dotenv');
//read env variables from config.env and then save them to node.js environment varibale
dotenv.config({ path: './config.env' });
const app = require('./app');
//this will be the starting file
//we should have 2 separate files for express and server
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

//connecting to hosted database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successfull!');
  });
//console.log(process.env);
//:STARTING THE SERVER
const port = 3000 || process.env.port;
app.listen(port, () => {
  console.log(`app running on port ${port} ...`);
});
