// ============================================================
// middleware/validation.js  —  The Gatekeeper
// "Never Trust the Client"
// ============================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// ---- utility: accumulate field-level errors ----------------
function buildErrors(checks) {
  const errors = {};
  checks.forEach(({ field, message, condition }) => {
    if (condition) {
      if (!errors[field]) errors[field] = [];
      errors[field].push(message);
    }
  });
  return errors;
}

function sendValidationError(res, errors) {
  return res.status(400).json({
    success: false,
    message: 'Validation failed. Please fix the errors below.',
    errors,
    timestamp: new Date().toISOString()
  });
}

// ============================================================
// CONTACT FORM
// ============================================================
function validateContact(req, res, next) {
  const { name, email, message, phone, subject } = req.body;

  const errors = buildErrors([
    // name
    { field: 'name',    message: 'Name is required.',                         condition: !name || !String(name).trim() },
    { field: 'name',    message: 'Name must be at least 2 characters.',       condition: name && String(name).trim().length < 2 },
    { field: 'name',    message: 'Name cannot exceed 50 characters.',         condition: name && String(name).trim().length > 50 },
    // email
    { field: 'email',   message: 'Email is required.',                        condition: !email || !String(email).trim() },
    { field: 'email',   message: 'Please provide a valid email address.',     condition: email && !EMAIL_REGEX.test(String(email).trim()) },
    // message
    { field: 'message', message: 'Message is required.',                      condition: !message || !String(message).trim() },
    { field: 'message', message: 'Message must be at least 10 characters.',   condition: message && String(message).trim().length < 10 },
    { field: 'message', message: 'Message cannot exceed 500 characters.',     condition: message && String(message).trim().length > 500 },
    // phone (optional)
    { field: 'phone',   message: 'Phone must be 7–15 digits if provided.',    condition: phone && !/^[+]?[\d\s\-().]{7,15}$/.test(String(phone).trim()) },
    // subject (optional enum)
    { field: 'subject', message: 'Invalid subject value.',                    condition: subject && !['reservation','custom-order','catering','feedback','other'].includes(subject) },
  ]);

  if (Object.keys(errors).length) return sendValidationError(res, errors);
  next();
}

// ============================================================
// ORDER
// ============================================================
function validateOrder(req, res, next) {
  const { itemId, quantity, customerName, customerEmail, specialInstructions } = req.body;
  const qty = Number(quantity);

  const errors = buildErrors([
    // itemId
    { field: 'itemId',              message: 'itemId is required.',                              condition: !itemId },
    // quantity
    { field: 'quantity',            message: 'Quantity is required.',                            condition: quantity === undefined || quantity === null || quantity === '' },
    { field: 'quantity',            message: 'Quantity must be a number.',                       condition: quantity !== undefined && quantity !== '' && isNaN(qty) },
    { field: 'quantity',            message: 'Quantity must be at least 1.',                     condition: !isNaN(qty) && qty < 1 },
    { field: 'quantity',            message: 'Quantity cannot exceed 20.',                       condition: !isNaN(qty) && qty > 20 },
    // customerName
    { field: 'customerName',        message: 'Customer name is required.',                       condition: !customerName || !String(customerName).trim() },
    { field: 'customerName',        message: 'Customer name must be at least 2 characters.',    condition: customerName && String(customerName).trim().length < 2 },
    { field: 'customerName',        message: 'Customer name cannot exceed 80 characters.',      condition: customerName && String(customerName).trim().length > 80 },
    // customerEmail
    { field: 'customerEmail',       message: 'Customer email is required.',                      condition: !customerEmail || !String(customerEmail).trim() },
    { field: 'customerEmail',       message: 'Please provide a valid email.',                    condition: customerEmail && !EMAIL_REGEX.test(String(customerEmail).trim()) },
    // specialInstructions (optional)
    { field: 'specialInstructions', message: 'Special instructions cannot exceed 200 characters.', condition: specialInstructions && String(specialInstructions).length > 200 },
  ]);

  if (Object.keys(errors).length) return sendValidationError(res, errors);
  next();
}

// ============================================================
// NEWSLETTER
// ============================================================
function validateSubscribe(req, res, next) {
  const { email } = req.body;

  const errors = buildErrors([
    { field: 'email', message: 'Email is required.',                    condition: !email || !String(email).trim() },
    { field: 'email', message: 'Please provide a valid email address.', condition: email && !EMAIL_REGEX.test(String(email).trim()) },
  ]);

  if (Object.keys(errors).length) return sendValidationError(res, errors);
  next();
}

module.exports = { validateContact, validateOrder, validateSubscribe };
