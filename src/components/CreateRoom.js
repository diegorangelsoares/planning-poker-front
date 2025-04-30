import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';

function CreateRoom() {
    const [roomName, setRoomName] = useState('');
    const navigate = useNavigate();
    const [createdRoomLink, setCreatedRoomLink] = useState('');

    const handleCreateRoom = () => {
        if (roomName.trim() !== '') {
            socket.emit('createRoom', roomName);
            // socket.on('roomCreated', ({ roomId }) => {
            //     navigate(`/room/${roomId}`);
            // });
        }

        let sequence = ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39', '?', '☕']; // Números pares de 0 a 60

        socket.emit('createRoom', { roomName, sequence });

        // Em vez de redirecionar, exibe o link
        const link = `${window.location.origin}/room/${roomName}`;
        setCreatedRoomLink(link);

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

            {!createdRoomLink && (
                <button className="button" onClick={handleCreateRoom}>Criar</button>
            )}

            {createdRoomLink && (
                <div className="link-section">
                    <h3>Sala criada com sucesso!</h3>
                    <p>ID da Sala: <strong>{roomName}</strong></p>
                    <p>Link para compartilhar:</p>
                    <input type="text" value={createdRoomLink} readOnly style={{ width: '100%' }} />
                </div>
            )}
            <div></div>
            <button className="button" onClick={voltarHome}>Voltar</button>
        </div>
    );
}

export default CreateRoom;