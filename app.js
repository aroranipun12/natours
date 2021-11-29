const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json()); //middleware(that can modify the incoming request data)(to access req.body)

//__dirname is the location of the current script
//JSON.parse -> converts json to array of JS objects
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//tours is the resource now!(verb)
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length, // tours is an array
    data: {
      tours: tours, //or just tours(es6)
    },
  });
});

app.get('/api/v1/tours/:id/', (req, res) => {
  const id = req.params.id * 1; //string to number *1
  if (id > tours.length) {
    return res.status(404).json({
      status: 'Failed',
      message: 'Invalid ID',
    });
  }
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  //console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});
//put,patch ->to update data, put->entire updated obj,patch->only some updated properties

const port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port} ...`);
});
