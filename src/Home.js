import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

function Home() {
    const [roomName, setRoomName] = useState('');
    const [sequence, setSequence] = useState('');
    const navigate = useNavigate();

    const createRoom = () => {
        const seqArray = sequence.split(',').map((s) => s.trim());
        socket.emit('createRoom', { roomName, sequence: seqArray });
        navigate(`/room/${roomName}`);
    };

    return (
        <div>
            <h1>Criar Sala de Planning Poker</h1>
            <input placeholder="Nome da Sala" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
            <input placeholder="Sequência (ex: 0,1,2,3,?)" value={sequence} onChange={(e) => setSequence(e.target.value)} />
            <button onClick={createRoom}>Criar</button>
        </div>
    );
}

export default Home;