const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();

// CORS sozlamasi — MUHIM
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api/tests', require('./routes/test'));
app.use('/api/upload', require('./routes/upload')); 
app.use('/api/users', require('./routes/user'));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB ulandi');
    app.listen(PORT, () => console.log(`✅ Server ishga tushdi: ${PORT}`));
  })
  .catch((err) => console.log('❌ MongoDB xatolik:', err.message));
