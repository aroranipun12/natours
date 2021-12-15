const express = require('express');
const tourController = require('../controllers/tourController');
const router = express.Router();

//router.param('id', tourController.checkID);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

//when you have only one thing to export
module.exports = router;
