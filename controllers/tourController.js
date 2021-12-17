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
    //first we build the query
    //making a hard copy

    //1A. Filtering
    const queryObj = { ...req.query }; //es6 trick of copying
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    //removing fields from queryObj
    excludedFields.forEach((el) => delete queryObj[el]);

    // console.log(req.query);
    // console.log(queryObj);

    // 1B. Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    // console.log(queryStr);
    // {diffculty:'easy', duration: {$gte:5} }
    // { duration: { gte: '5' }, difficulty: 'easy' }

    // to replace -> gte,gt,lte,lt with $gte...... using regular exp
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));
    // writing query(these methods like find,they return a query)
    let query = Tour.find(JSON.parse(queryStr));

    // 2. Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
      // sort('price ratingsAverage')
    } else {
      query = query.sort('-createdAt'); // so that new ones appear first
    }

    //3. Field Limiting(let say client only want the names)
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
      // - means excluding
    }

    // 4. Pagination
    //default is page 1 , *1 for string to number
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }

    // execute query
    const tours = await query;

    //Send response
    res.status(200).json({
      status: 'success',
      results: tours.length, // tours is an array
      data: {
        tours: tours, //or just tours(es6)
      },
    });

    //Another way of doing the same thing
    // const query = await Tour.find()
    //   .where('duration')
    //   .equals(req.query.duration)
    //   .where('difficulty')
    //   .equals(req.query.difficulty);
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
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
      message: err,
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
