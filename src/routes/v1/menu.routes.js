const express = require('express');
const router = express.Router();
const {
    create,
    update,
    getMany,
    findOne,
    deleteOne,
    // getToursWithin,
    // getDistances,
    // getTourStats,
    // getMonthlyPlan,
} = require('../../controllers/menu.controllers');
const {
    isAuthenticated,
    isAuthorized,
} = require('../../middlewares/auth.middlewares');
// const { aliasTopTours } = require('../middlewares/aliasMiddlewares');
// const { authenticate, authorize } = require('./../middlewares/authMiddlewares');
// const reviewRouter = require('../routes/reviewRoutes'); // Using Nested routes with express
// const {
//     uploadTourPhotos,
//     resizeTourPhotos,
// } = require('../middlewares/multerMiddlewares');

router
    .route('/')
    .post(isAuthenticated, isAuthorized('admin', 'vendor'), create)
    .get(isAuthenticated, getMany);

router
    .route('/:id')
    .get(isAuthenticated, findOne)
    .post(isAuthenticated, isAuthorized('admin', 'vendor'), update)
    .delete(isAuthenticated, isAuthorized('admin', 'vendor'), deleteOne);

// NESTED ROUTES
// router.use('/:tourId/reviews', reviewRouter); // Telling the TourRouter to use the reviewRouter
// whenever the above url is matched --> route mounting a nested route

// ALIASING with middleware and reusing controllers
// router.route('/top5Cheap').get(aliasTopTours, getAllTours); // You need to put this route at the top above routes like
// // router.route('/:id') which a param that matches any(/:id), to ensure that this route will match when requested

// // AGGREGATION PIPELINE - Matching and Grouping
// router.route('/tourStats').get(getTourStats); // You need to put this route at the top above routes like
// // router.route('/:id') which a param that matches any(/:id), to ensure that this route will match when requested

// // GEO-SPATIAL QUERIES
// router.route('/within/:distance/center/:latlng/unit/:unit').get(getToursWithin);
// // Using query strings
// // router.route('/within').get(getToursWithin)
// // http://localhost:5000/within?distance=233&center=40,45&unit=mi

// // GEO-SPATIAL AGGREGATION
// router.route('/distances/:latlng/unit/:unit').get(getDistances);

// // UNWINDING
// router
//     .route('/monthlyPlan/:year')
//     .get(
//         authenticate,
//         authorize('admin', 'lead-guide', 'guide'),
//         getMonthlyPlan,
//     ); // You need to put this route at the top above routes like
// // router.route('/:id') which a param that matches any(/:id), to ensure that this route will match when requested

// router
//     .route('/')
//     .post(authenticate, authorize('admin', 'lead-guide'), createTour)
//     .get(getAllTours);

// router
//     .route('/:id')
//     .patch(
//         authenticate,
//         authorize('admin', 'lead-guide'),
//         uploadTourPhotos,
//         resizeTourPhotos,
//         updateTour,
//     )
//     .get(getTour)
//     .delete(authenticate, authorize('admin', 'lead-guide'), deleteTour);

module.exports = router;