const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const http = require('http'); // ← socket.io uchun
const { Server } = require('socket.io');
const userRoutes = require('./routes/user');

dotenv.config();

const app = express();
const server = http.createServer(app); // ← Express app o‘rniga http server

// CORS sozlamasi — MUHIM
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api/tests', require('./routes/test'));
app.use('/api/upload', require('./routes/upload')); 
app.use('/api/users', require('./routes/user'));
app.use('/api/users', userRoutes);

// SOCKET.IO boshlanishi
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ["GET", "POST"],
    credentials: true,
  }
});

// Har bir foydalanuvchi ulanganida:
io.on('connection', (socket) => {
  console.log('🟢 Yangi ulanish:', socket.id);

  // Frontenddan kelgan xabarni qabul qilish:
  socket.on('send_message', (data) => {
    console.log('💬 Xabar keldi:', data);

    // Barcha foydalanuvchilarga yuborish:
    io.emit('receive_message', data);
  });

  // Foydalanuvchi uzilganda:
  socket.on('disconnect', () => {
    console.log('🔴 Uzildi:', socket.id);
  });
});

// MongoDB ulanishi va serverni ishga tushirish
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB ulandi');
    server.listen(PORT, () => console.log(`✅ Server ishga tushdi: ${PORT}`));
  })
  .catch((err) => console.log('❌ MongoDB xatolik:', err.message));
