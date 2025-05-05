import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';

function JoinRoom() {

    const [roomId, setRoomId] = useState('');
    const [userName, setUserName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // const handleJoinRoom = () => {
    //     if (roomId.trim() !== '' && userName.trim() !== '') {
    //         socket.emit('joinRoom', { roomId, userName });
    //         navigate(`/room/${roomId}`);
    //     }
    // };
    const handleJoinRoom = () => {
        if (roomId.trim() !== '') {
            socket.emit('checkRoomExists', roomId, (response) => {
                if (response.exists) {
                    navigate(`/room/${roomId}`);
                } else {
                    setError('Sala não encontrada.');
                }
            });
        } else {
            setError('Informe o ID da sala.');
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
                onChange={(e) => {
                    setRoomId(e.target.value);
                    setError('');
                }}
            />
            <input
                className="input"
                type="text"
                placeholder="Seu Nome"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <button className="button" onClick={handleJoinRoom}>Entrar</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div></div>
            <button className="button" onClick={voltarHome}>Voltar</button>
        </div>
    );
}

export default JoinRoom;
