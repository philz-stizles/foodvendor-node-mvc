const AppError = require('../errors/app.error');
const Menu = require('../models/Menu');
const Order = require('../models/Order');

exports.getSignupView = async (req, res) => {
  // If user is authenticated.
  if (res.locals.isAuthenticated) {
    // Render home page.
    res.render('overview', { title: 'All Menus' });
  } else {
    // Render signup page.
    res.render('signup', { title: 'Sign up for a free account' });
  }
};

exports.getLoginView = async (req, res) => {
  // Render login page.
  res.render('login', { title: 'Log into your account' });
};

exports.getOverView = async (req, res) => {
  // Render template with data
  res.render('overview', { title: 'All Menus' });
};

exports.getMenusView = async (req, res, next) => {
  // Get menus with reviews
  const menus = await Menu.find({});

  // Render template with data
  res.render('menus', { title: `Menus`, menus });
};

exports.getMenuView = async (req, res, next) => {
  console.log('get tour', req.params.slug);
  // Get tour data including reviews and guides
  const menu = await Menu.findOne({ slug: req.params.slug });

  // Check if menu exists
  if (!menu) {
    return next(new AppError(404, 'Tour does not exist'));
  }

  // Build template

  // Render template with data
  res.render('tour', { title: `${menu.name} Tour`, menu });
};

exports.getCartView = async (req, res) => {
  res.render('cart', {
    title: 'Your Cart',
    activeLink: '/cart',
  });
};

exports.getDashboardView = async (req, res) => {
  res.render('dashboard', {
    title: 'Your Dashboard',
    activeLink: '/dashboard',
  });
};

exports.createMyMenuView = async (req, res) => {
  res.render('create-menu', { title: 'Your Dashboard' });
};

exports.getMyMenusView = async (req, res) => {
  // Get menus with reviews
  if (req.query.mode && req.query.mode === 'create') {
    const menus = await Menu.find({ creator: res.locals.user.id });
    res.render('my-menus', {
      title: 'Your Menus',
      menus,
      mode: req.query.mode,
      activeLink: '/menus/me',
    });
  } else {
    const menus = await Menu.find({ creator: res.locals.user.id });
    res.render('my-menus', {
      title: 'Your Menus',
      menus,
      mode: 'list',
      activeLink: '/menus/me',
    });
  }
};

exports.updateMyMenuView = async (req, res) => {
  res.render('my-orders', { title: 'Your Dashboard' });
};

exports.deleteMyMenuView = async (req, res) => {
  res.render('stats', { title: 'Your Dashboard' });
};

exports.getMyOrdersView = async (req, res) => {
  // Get menus with reviews
  const orders = await Order.find({ creator: res.locals.user.id });
  res.render('my-orders', {
    title: 'Your Orders',
    orders,
    activeLink: '/orders/me',
  });
};

exports.getMyCategoriesView = async (req, res) => {
  // Get menus with reviews
  const orders = await Order.find({ creator: res.locals.user.id });
  res.render('my-orders', {
    title: 'Your Orders',
    orders,
    activeLink: '/categories/me',
  });
};

exports.getMyCouponsView = async (req, res) => {
  // Get menus with reviews
  const orders = await Order.find({ creator: res.locals.user.id });
  res.render('my-coupons', {
    title: 'Your Orders',
    orders,
    activeLink: '/coupons/me',
  });
};

// // exports.getMyToursView = async (req, res, next) => {
// //     // const bookings = await Booking.find({ creator: res.locals.user.id });
// //     const tourIds = bookings.map((booking) => booking.tour);
// //     const tours = await Tour.find({ _id: { $in: tourIds } });

// //     res.render('overview', { title: 'My Tours', tours });
// // };

// exports.getStatsView = async (req, res) => {
//   res.render('stats', { title: 'Your Dashboard' });
// };

// exports.updateUser = async (req, res) => {
//   const updatedUser = await User.findByIdAndUpdate(
//     res.locals.user.id,
//     {
//       name: req.body.name,
//       email: req.body.email,
//     },
//     { new: true, runValidators: true },
//   );

//   res.render('dashboard', { title: 'Your Dashboard', user: updatedUser });
// };
