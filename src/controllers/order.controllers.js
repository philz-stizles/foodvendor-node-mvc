const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const AppError = require('../errors/app.error');
const Menu = require('../models/Menu');
const Booking = require('../models/Order');
const User = require('../models/User');

exports.getCheckoutSession = async (req, res, next) => {
  // Get the currently booked menu
  // eslint-disable-next-line prefer-destructuring
  const id = req.params.menuId;
  const menu = await Menu.findOne({ id });
  if (!menu) return next(new AppError(404, 'Resource does not exist'));

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${menu.name} Tour`,
            description: menu.summary,
            images: [
              `${req.protocol}://${req.get('host')}/img/menus/${
                menu.imageCover
              }`,
            ],
          },
          unit_amount: menu.price * 100, // expects cents, so convert to cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    // success_url: `${req.protocol}://${req.get('host')}/my-menus/?menu=${menuId}&creator=${req.user.id}&price=${menu.price}`,
    success_url: `${req.protocol}://${req.get('host')}/my-menus?alert=booking`,
    cancel_url: `${req.protocol}://${req.get('host')}/menu/${menu.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.menuId,
  });

  console.log(session);

  res.json({ status: true, data: session.id, message: 'success' });
};

// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
//   // This is only temporary because it is not secure, anyone can make booking without paying
//   const { menu, creator, price } = req.query
//   if(!menu && !creator && !price) return next()

//   await Booking.create({ menu, creator, price })

//   res.redirect(`${req.originalUrl.split('?')[0]}`)
// })

const createBookingCheckout = async (session) => {
  console.log(session);
  const menu = session.client_reference_id;
  const creator = (await User.findOne({ email: session.customer_email }))._id;
  const price = session.amount_total / 100;

  await Booking.create({ menu, creator, price });
};

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    return res.status(400).send(`Webhook error: ${error.message}`);
  }
  console.log(event);

  if (event.type === 'checkout.session.completed') {
    createBookingCheckout(event.data.object);
  }

  res.status(200).json({ received: true });
};

// USING HANDLER FACTORY
exports.createOrder = (req, res, next) => {};
exports.getOrders = (req, res, next) => {};
exports.getOrder = (req, res, next) => {};
exports.updateOrder = (req, res, next) => {};
exports.cancelOrder = (req, res, next) => {};
