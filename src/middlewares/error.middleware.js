// eslint-disable-next-line no-unused-vars
module.exports = (err, _req, res, _next) => {
  const status = err.status ? err.status : 500;
  const message = err.message ? err.message : 'Please try again later';

  // eslint-disable-next-line no-console
  console.log(err.message);

  return res.status(status).json({ status: false, message });
};
