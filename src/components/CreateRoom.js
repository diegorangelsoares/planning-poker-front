import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';

function CreateRoom() {
    const [roomName, setRoomName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [createdRoomLink, setCreatedRoomLink] = useState('');
    const navigate = useNavigate();

    const handleCreateRoom = () => {
        if (roomName.trim() !== '') {
            let sequence = ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39', '?', '☕'];

            socket.emit('createRoom', { roomName, sequence });

            socket.on('roomCreated', ({ roomId }) => {
                setRoomId(roomId);
                setCreatedRoomLink(`https://www.pleinipouquer.com/room/${roomId}`);
            });
        } else {
            alert('Digite um nome para sala!');
        }
    };

    const voltarHome = () => {
        navigate(`/`);
    };

    return (
        <div>
            {!createdRoomLink && (
                <>
                    <h2>Criar Sala</h2>
                    <input
                        className="input"
                        type="text"
                        placeholder="Nome da Sala"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                    />
                    <button className="button button-margin-top" onClick={handleCreateRoom}>Criar</button>
                </>
            )}

            {createdRoomLink && (
                <div className="link-section">
                    <h3>Sala criada com sucesso!</h3>
                    <p>ID da Sala: <strong>{roomId}</strong></p>
                    {/*<p>Link: <a href={createdRoomLink} target="_blank" rel="noopener noreferrer">{createdRoomLink}</a></p>*/}
                </div>
            )}
            <div></div>
            <button className="button button-margin-top" onClick={voltarHome}>Voltar</button>
        </div>
    );
}

export default CreateRoom;
