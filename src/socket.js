// src/socket.js
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000'; // Render.com bo‘lsa o‘zgartiring

const socket = io(SOCKET_URL, {
  withCredentials: true,
});

export default socket;
