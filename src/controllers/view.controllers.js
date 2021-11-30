const AppError = require('../errors/app.error');
const Menu = require('../models/Menu');

exports.getOverView = async (req, res) => {
  // Render template with data
  res.render('overview', { title: 'All Tours' });
};

exports.getMenusView = async (req, res, next) => {
  // Get menus with reviews
  const menus = await Menu.find();

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

exports.getLoginView = async (req, res) => {
  // Render template
  res.render('login', { title: 'Log into your account' });
};

exports.getSignupView = async (req, res) => {
  // Render template
  res.render('signup', { title: 'Sign up for a free account' });
};

exports.getDashboardView = async (req, res) => {
  // Render template
  if (!res.locals.isAuthenticated) {
    return res.redirect('/login');
  }

  res.render('dashboard', { title: 'Your Dashboard' });
};

exports.createMyMenuView = async (req, res) => {
  res.render('stats', { title: 'Your Dashboard' });
};

exports.getMyMenusView = async (req, res) => {
  res.render('stats', { title: 'Your Dashboard' });
};

exports.updateMyMenuView = async (req, res) => {
  res.render('stats', { title: 'Your Dashboard' });
};

exports.deleteMyMenuView = async (req, res) => {
  res.render('stats', { title: 'Your Dashboard' });
};

// // exports.getMyToursView = async (req, res, next) => {
// //     // const bookings = await Booking.find({ creator: req.user.id });
// //     const tourIds = bookings.map((booking) => booking.tour);
// //     const tours = await Tour.find({ _id: { $in: tourIds } });

// //     res.render('overview', { title: 'My Tours', tours });
// // };

// exports.getStatsView = async (req, res) => {
//   res.render('stats', { title: 'Your Dashboard' });
// };

// exports.updateUser = async (req, res) => {
//   const updatedUser = await User.findByIdAndUpdate(
//     req.user.id,
//     {
//       name: req.body.name,
//       email: req.body.email,
//     },
//     { new: true, runValidators: true },
//   );

//   res.render('dashboard', { title: 'Your Dashboard', user: updatedUser });
// };
