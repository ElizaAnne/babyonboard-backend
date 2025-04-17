// src/app.js
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const app = express();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.json());

// Routes
app.use('/api/payment', require('./routes/payment'));
app.use('/api/product', require('./routes/product'));

export default app;