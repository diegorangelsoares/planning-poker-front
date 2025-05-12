import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';

function JoinRoom() {
    const [roomId, setRoomId] = useState('');
    const [userName, setUserName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleJoinRoom = () => {
        if (roomId.trim() && userName.trim()) {
            socket.emit('checkRoomExists', roomId, (response) => {
                if (response.exists) {
                    localStorage.setItem('roomId', roomId);
                    localStorage.setItem('userName', userName);
                    navigate(`/room/${roomId}`);
                } else {
                    setError('Sala não encontrada.');
                }
            });
        } else {
            setError('Informe o ID da sala e seu nome.');
        }
    };

    const voltarHome = () => {
        navigate('/');
    };

    return (
        <div className="card-box">
            <h2>Entrar na Sala</h2>
            <input
                className="input input-texto"
                type="text"
                placeholder="ID da Sala"
                value={roomId}
                onChange={(e) => {
                    setRoomId(e.target.value);
                    setError('');
                }}
            />
            <div></div>
            <input
                className="input input-texto"
                type="text"
                placeholder="Seu Nome"
                value={userName}
                onChange={(e) => {
                    setUserName(e.target.value);
                    setError('');
                }}
            />
            <div className="button-row">
                <button className="button" onClick={handleJoinRoom}>Entrar</button>
                <button className="button" onClick={voltarHome}>Voltar</button>
            </div>
            {error && <p className="error-text">{error}</p>}
        </div>
    );
}

export default JoinRoom;
