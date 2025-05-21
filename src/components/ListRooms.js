import { useEffect, useState } from 'react';
import socket from '../socket';

function ListRooms() {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        socket.emit('getAllRooms', (roomList) => {
            setRooms(roomList);
        });
    }, []);

    return (
        <div className="card-box">
            <h2 style={{ marginBottom: '20px' }}>Salas Criadas</h2>

            {rooms.length === 0 ? (
                <p>Nenhuma sala encontrada.</p>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '20px'
                }}>
                    {rooms.map((room) => (
                        <div
                            key={room.roomId}
                            style={{
                                backgroundColor: '#f9f9f9',
                                padding: '15px',
                                borderRadius: '8px',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                textAlign: 'left'
                            }}
                        >
                            <p><strong>ID da Sala:</strong> {room.roomId}</p>
                            <p><strong>Criador:</strong> {room.roomName}</p>
                            <p><strong>Quantidade de usuários:</strong> {Object.keys(room.users || {}).length}</p>
                            <p><strong>Cartas:</strong> {room.sequence?.join(', ')}</p>
                            <p><strong>Votos Revelados:</strong> {room.revealed ? 'Sim' : 'Não'}</p>
                            <p><strong>Média:</strong> {room.average}</p>

                            {room.historias && room.historias.length > 0 && (
                                <div style={{ marginTop: '10px' }}>
                                    <strong>Histórias:</strong>
                                    <ul style={{ paddingLeft: '18px', marginTop: '4px' }}>
                                        {room.historias.map((hist, idx) => (
                                            <li key={idx}>
                                                📝 {hist.name}
                                                {hist.revealed && ` (Média: ${hist.average})`}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ListRooms;
