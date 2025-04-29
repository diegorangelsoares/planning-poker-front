import { io } from 'socket.io-client';

const socket = io('http://localhost:4000'); // endereço do seu backend

export default socket;
