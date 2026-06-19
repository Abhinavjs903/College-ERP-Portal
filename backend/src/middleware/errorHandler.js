// Centralized error handler. Express identifies it by its four arguments.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Log full details server-side only.
  console.error(err.stack);

  const status = err.statusCode || 500;

  // Expose the message for client (4xx) errors and errors explicitly marked
  // safe; hide internal details for 5xx to avoid information disclosure.
  const expose = err.expose === true || (status >= 400 && status < 500);
  const message = expose
    ? err.message || 'Internal server error'
    : 'Internal server error';

  res.status(status).json({ message });
};

module.exports = errorHandler;
