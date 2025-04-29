import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';

function CreateRoom() {
    const [roomName, setRoomName] = useState('');
    const navigate = useNavigate();

    const handleCreateRoom = () => {
        if (roomName.trim() !== '') {
            socket.emit('createRoom', roomName);
            socket.on('roomCreated', ({ roomId }) => {
                navigate(`/room/${roomId}`);
            });
        }
    };

    const voltarHome = () => {
        navigate(`/`);
    };

    return (
        <div>
            <h2>Criar Sala</h2>
            <input
                className="input"
                type="text"
                placeholder="Nome da Sala"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
            />
            <button className="button" onClick={handleCreateRoom}>Criar</button>
            <div></div>
            <button className="button" onClick={voltarHome}>Voltar</button>
        </div>
    );
}

export default CreateRoom;