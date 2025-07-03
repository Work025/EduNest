// src/socket.js
import { io } from 'socket.io-client';

const SOCKET_URL = 'https://edunest-k770.onrender.com'; // bu backend render URL

const socket = io(SOCKET_URL, {
  withCredentials: true,
});

export default socket;
