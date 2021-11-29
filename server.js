const app = require('./app');
//this will be ther starting file
//we should have 2 separate files for express and server
//:STARTING THE SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port} ...`);
});
