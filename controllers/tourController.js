const fs = require('fs');
const Tour = require('../models/tourModel');
//__dirname is the location of the current script

//only for testing
// //JSON.parse -> converts json to array of JS objects
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'missing name or price',
//     });
//   }
//   next();
// };

// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is ${val}`);
//   //validating tour id here
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'Failed',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// };
exports.getAllTours = async (req, res) => {
  //find returns a promise, also it returns an array
  try {
    const tours = await Tour.find();

    res.status(200).json({
      status: 'success',
      results: tours.length, // tours is an array
      data: {
        tours: tours, //or just tours(es6)
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    //Tour.findOne({_id:req.params.id})
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour, //or just tour(es6)
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// const tour = tours.find((el) => el.id === id);

// res.status(200).json({
//   status: 'success',
//   data: {
//     tour,
//   },
// });

exports.createTour = async (req, res) => {
  // const newTour = new Tour({})
  // newTour.save() -> returns a promise

  //create also returns a promise
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //to return the modified  doc
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Could not be deleted',
    });
  }
};
