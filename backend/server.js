// server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app); // ⬅️ Express’ni socket uchun o‘rab oldik

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }
});

// socket.io ni expressda ishlatish uchun
app.set('io', io);

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/user'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB ulandi');
    server.listen(process.env.PORT || 5000, () => {
      console.log(`✅ Server ishga tushdi: ${process.env.PORT}`);
    });
  })
  .catch(err => console.log('❌ MongoDB xatolik:', err.message));
