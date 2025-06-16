// src/app.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import cors from 'cors';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure dotenv to look for .env file in the project root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// Add some debug logging
console.log('Environment check:');
console.log('SUPABASE_URL exists:', !!process.env.SUPABASE_URL);
console.log('SUPABASE_SERVICE_KEY exists:', !!process.env.SUPABASE_SERVICE_KEY);

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
import paymentRoutes from './routes/payment.js';
import productRoutes from './routes/product.js';
import imageRoutes from './routes/image.js';

// Routes
app.use('/api/payment', paymentRoutes);
app.use('/api/product', productRoutes);
app.use('/api/image', imageRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Supabase URL: ${supabaseUrl ? 'Set' : 'Not set'}`);
  console.log(`Supabase Key: ${supabaseKey ? 'Set' : 'Not set'}`);
});

export default app;
