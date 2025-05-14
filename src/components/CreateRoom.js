import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';

function CreateRoom() {
    const [roomName, setRoomName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [createdRoomLink, setCreatedRoomLink] = useState('');
    const [sequenceType, setSequenceType] = useState('sequential');
    const navigate = useNavigate();

    const generateSequence = (type) => {
        let sequence = [];
        if (type === 'sequential') {
            sequence = Array.from({ length: 40 }, (_, i) => String(i));
        } else if (type === 'even') {
            sequence = Array.from({ length: 40 }, (_, i) => String(i * 2));
        } else if (type === 'fibonacci') {
            let fib = [0, 1];
            while (fib.length < 10) {
                const next = fib[fib.length - 1] + fib[fib.length - 2];
                fib.push(next);
            }
            sequence = fib.slice(0, 40).map(String);
        }
        return sequence.concat(['?', '☕']);
    };

    const handleCreateRoom = () => {
        if (roomName.trim() !== '') {
            setIsCreating(true);
            const sequence = generateSequence(sequenceType);

            // Registra antes de emitir
            socket.once('roomCreated', ({ roomId }) => {
                setRoomId(roomId);
                setCreatedRoomLink(`https://www.pleinipouquer.com/room/${roomId}`);
                setIsCreating(false);
                localStorage.setItem('roomId', roomId);
                localStorage.setItem('userName', roomName);
                navigate(`/room/${roomId}`);
            });

            socket.emit('createRoom', { roomName, sequence });

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
                        className="input input-texto"
                        type="text"
                        placeholder="Dono da sala"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                    />
                    <div></div>
                    <select
                        className="input input-texto"
                        value={sequenceType}
                        onChange={(e) => setSequenceType(e.target.value)}
                    >
                        <option value="sequential">Sequencial padrão (0,1,2,3...)</option>
                        <option value="even">Pares padrão (0,2,4,6...)</option>
                        <option value="fibonacci">Fibonacci</option>
                    </select>
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