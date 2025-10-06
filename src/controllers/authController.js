// src/controllers/authController.js
const { supabase } = require('../supabase/client');

exports.register = async (req, res) => {
  const { email, password, fullName } = req.body;
  try {
    // Register user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name: fullName },
      email_confirm: true
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Optionally: Insert into a separate 'profiles' table
    // await supabase.from('profiles').insert([{ id: data.user.id, full_name: fullName }]);

    res.status(201).json({ message: 'User registered! Please check your email to confirm the account.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};
