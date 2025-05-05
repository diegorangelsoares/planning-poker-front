import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';

function CreateRoom() {
    const [roomName, setRoomName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [createdRoomLink, setCreatedRoomLink] = useState('');
    const navigate = useNavigate();

    const handleCreateRoom = () => {
        if (roomName.trim() !== '') {
            setIsCreating(true);
            const sequence = Array.from({ length: 40 }, (_, i) => String(i)).concat(['?', '☕']);

            socket.emit('createRoom', { roomName, sequence });

            socket.on('roomCreated', ({ roomId }) => {
                setRoomId(roomId);
                setCreatedRoomLink(`https://www.pleinipouquer.com/room/${roomId}`);
                setIsCreating(false);
            });
        } else {
            alert('Digite um nome para sala!');
        }
    };

    const voltarHome = () => navigate('/');

    return (
        <div className="card-box">
            {!createdRoomLink ? (
                <>
                    <h2>Criar Sala</h2>
                    <input
                        className="input"
                        type="text"
                        placeholder="Nome da Sala"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                    />
                    <div className="button-row">
                        <button
                            className="button"
                            onClick={handleCreateRoom}
                            disabled={isCreating}
                        >
                            {isCreating ? 'Criando...' : 'Criar'}
                        </button>
                        <button className="button" onClick={voltarHome}>Voltar</button>
                    </div>
                </>
            ) : (
                <>
                    <h3>Sala criada com sucesso!</h3>
                    <p>ID: <strong>{roomId}</strong></p>
                    <div className="button-row">
                        <button className="button" onClick={voltarHome}>Voltar</button>
                    </div>
                </>
            )}
        </div>
    );
}

export default CreateRoom;
