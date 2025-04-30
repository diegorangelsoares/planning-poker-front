import { io } from 'socket.io-client';

// const socket = io('http://localhost:4000'); // endereço do seu backend
const socket = io('https://planning-poker-backend-xts0.onrender.com');


export default socket;
