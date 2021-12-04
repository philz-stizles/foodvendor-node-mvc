const path = require('path');
const express = require('express');
const expressRateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const swaggerUI = require('swagger-ui-express');
// const sass = require('node-sass');
// Middlewares.
const globalErrorHandler = require('./middlewares/error.middleware');
const notFoundHandler = require('./middlewares/notfound.middleware');
// const { webhookCheckout } = require('./controllers/booking.controllers');
// Routes
const authRoutes = require('./routes/v1/auth.routes');
const menuRoutes = require('./routes/v1/menu.routes');
// const userRoutes = require('./routes/v1/user.routes');
// const vendorRoutes = require('./routes/v1/vendor.routes');
// const categoryRoutes = require('./routes/v1/category.routes');
// const cartRoutes = require('./routes/v1/cart.routes');
const orderRoutes = require('./routes/v1/order.routes');
// const couponRoutes = require('./routes/v1/coupon.routes');
// const transactionRoutes = require('./routes/v1/transaction.routes');
// const fileRoutes = require('./routes/v1/file.routes');
// API Docs.
const swaggerDocument = require('./docs');
// Initialize Express App.
const app = express();

//
app.enable('trust proxy');

// app.use(
//   sass.middlewar({
//     src: `${__dirname}/src/public/sass`, //where the sass files are
//     dest: `${__dirname}/src/public/css`, //where css should go
//     debug: true, // obvious
//   }),
// );

// View Template.
app.set('views', [path.join(__dirname, '/views')]);
app.set('view engine', 'pug');

// app.locals.basedir = path.join(__dirname, 'views');
// Cors.
app.use(
  cors({
    // origin: 'https://someurl.com'
  }),
); // cors() is a middleware which means that you can implement on specific routes as middleware

app.options('*', cors());
// app.options('/api/v1/tours/:id', cors()) // You can also use for specific routes

// SERVING STATIC FILES
// app.use(express.static(path.join(__dirname, 'static')))
app.use(express.static(path.join(__dirname, 'public'))); // This says, anytime there is a request from the
// server, look in the public folder e.g for http://localhost:5000/overview.html, overview should be placed
// in the root of the public folder
app.use(express.static(path.join(__dirname, 'uploads')));

// SECURITY - Anti Cross-site Scripting - Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

// LOGGING - DEVELOPMENT
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// SECURITY - Anti Brute Force Attacks - Set rate limiting
app.use(
  '/api',
  expressRateLimit({
    // By specifying api, this would then affect all the routes since they all have /api
    max: 100, // no of requests per IP
    windowMs: 60 * 60 * 1000, // per period(1 hr)
    message: {
      status: false,
      message: 'Too many requests from this IP, please try again in an hour',
    },
  }),
);

// STRIPE CHECKOUT WEBHOOK
// When we needs this body in a raw form
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  // webhookCheckout,
);

// REQUEST BODY PARSING
app.use(express.json({ limit: '10kb' })); // This would limit the body size to 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // This would limit the body size to 10kb
app.use(cookieParser()); // Parses data from cookies

// SECURITY - Data sanitization against NoSQL query injection
app.use(mongoSanitize()); // It will look at the req.body, req.query and req.params, and basically
// filter out all of the dollar($) signs and dots(.) in the values

// SECURITY - Data sanitization against XSS - cross site scripting
app.use(xss()); // This would clean any user input from malicious html code

// SECURITY - Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['duration', 'price'], // specify parameters that can be duplicated in the query
  }),
);

// COMPRESSION
app.use(compression()); //

// TESTING MIDDLEWARE
app.use((req, res, next) => {
  // console.log(req.cookies)
  next();
});

// MVC - VIEW RENDERING
app.use('/', require(`./routes/v1/view.routes`));

// RESOURCES ROUTES
const api = process.env.API_URL;
app.use(`${api}/auth`, authRoutes);
app.use(`${api}/menus`, menuRoutes);
// app.use(`${api}/users`, userRoutes);
// app.use(`${api}/vendors`, vendorRoutes);
// app.use(`${api}/categories`, categoryRoutes);
// app.use(`${api}/products`, productRoutes);
// app.use(`${api}/carts`, cartRoutes);
app.use(`${api}/orders`, orderRoutes);
// app.use(`${api}/coupons`, couponRoutes);
// app.use(`${api}/transactions`, transactionRoutes);
// app.use(`${api}/files`, fileRoutes);

// API documentation.
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Handle unhandled routes - routes that are not caught by any routers
app.all('*', notFoundHandler);

// Global error handling.
app.use(globalErrorHandler);

module.exports = app;
