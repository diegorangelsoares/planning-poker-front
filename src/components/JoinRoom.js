import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';

function JoinRoom() {
    const [roomId, setRoomId] = useState('');
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    const handleJoinRoom = () => {
        if (roomId.trim() !== '' && userName.trim() !== '') {
            socket.emit('joinRoom', { roomId, userName });
            navigate(`/room/${roomId}`);
        }
    };

    const voltarHome = () => {
        navigate(`/`);
    };

    return (
        <div>
            <h2>Entrar na Sala</h2>
            <input
                className="input"
                type="text"
                placeholder="ID da Sala"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
            />
            <input
                className="input"
                type="text"
                placeholder="Seu Nome"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <button className="button" onClick={handleJoinRoom}>Entrar</button>
            <div></div>
            <button className="button" onClick={voltarHome}>Voltar</button>
        </div>
    );
}

export default JoinRoom;
