// src/middleware/validateRegistration.js
module.exports = (req, res, next) => {
  const { email, password, confirmPassword, fullName } = req.body;
  if (!email || !password || !confirmPassword || !fullName) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }
  next();
};
