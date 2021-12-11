//everything that is not related to express we don't do it in this file

const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//1: MIDDLEWARE
//console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //http request logging middleware
}
app.use(express.json()); //middleware(that can modify the incoming request data)(to access req.body)
app.use(express.static(`${__dirname}/public`));

//this middleware applies to all requests coz we didn't specify any route
app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//Mounting the router//these 2 router are actually middleware
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
