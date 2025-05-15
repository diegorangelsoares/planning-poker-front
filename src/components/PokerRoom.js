import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import socket from '../socket';

function PokerRoom() {
    const { roomId: paramRoomId } = useParams();
    const [roomId, setRoomId] = useState(paramRoomId);
    const [userName, setUserName] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [canReveal, setCanReveal] = useState(false);
    const [votes, setVotes] = useState([]);
    const [average, setAverage] = useState(null);
    const [cards, setCards] = useState([]);
    const [roomName, setRoomName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {

        const savedRoomId = localStorage.getItem('roomId');
        const savedUserName = localStorage.getItem('userName');

        if (savedRoomId && savedUserName) {
            socket.emit('checkRoomExists', savedRoomId, ({ exists }) => {
                if (exists) {
                    socket.emit('joinRoom', { roomId: savedRoomId, userName: savedUserName }, () => {
                        // ✅ Após confirmar entrada, requisita os dados da sala
                        socket.emit('getRoomData', savedRoomId);
                        setRoomId(savedRoomId);
                        setUserName(savedUserName);
                    });
                } else {
                    console.info("nenhum usuario logado!");
                    localStorage.removeItem('roomId');
                    localStorage.removeItem('userName');
                    navigate('/');
                }
            });
        } else {
            navigate('/');
        }
    }, [navigate, paramRoomId]);

    useEffect(() => {
        socket.on('removed', () => {
            alert('Você foi removido da sala.');
            localStorage.removeItem('roomId');
            localStorage.removeItem('userName');
            navigate('/');
        });

        return () => {
            socket.off('removed');
        };
    }, []);

    useEffect(() => {
        socket.on('updateUsers', ({ users }) => setUsers(users));
        socket.on('allVoted', () => setCanReveal(true));
        socket.on('votesRevealed', ({ votes, average }) => {
            setVotes(votes);
            setAverage(average);
        });

        socket.on('votesReset', () => {
            setVotes([]);
            setSelectedCard(null);
            setCanReveal(false);
        });

        socket.on('setSequence', ({ sequence }) => {
            setCards(sequence);
        });

        socket.on('roomInfo', ({ roomName }) => {
            setRoomName(roomName);
        });

        socket.on('roomData', ({ roomName, cardOptions, users, votes, votingOpen }) => {
            setRoomName(roomName);
            setCards(cardOptions);
            setUsers(users);
            if (!votingOpen) {
                setVotes(votes);
                setCanReveal(false);
                setAverage('?');
            }
        });

        return () => {
            socket.off('updateUsers');
            socket.off('allVoted');
            socket.off('votesRevealed');
            socket.off('votesReset');
            socket.off('setSequence');
            socket.off('roomInfo');
            socket.off('roomData');
        };
    }, []);

    const handleVote = (value) => {
        setSelectedCard(value);
        socket.emit('vote', { roomId, vote: value });
    };

    const handleRevealVotes = () => socket.emit('revealVotes', roomId);
    const handleResetVotes = () => socket.emit('resetVotes', roomId);

    const voltarHome = () => {
        localStorage.removeItem('roomId');
        localStorage.removeItem('userName');
        navigate('/');
    };

    const handleRemoveUser = (targetName) => {
        if (window.confirm(`Deseja remover ${targetName} da sala?`)) {
            socket.emit('removeUser', { roomId, userName: targetName });
        }
    };

    return (
        <div className="card-box">
            <div className="info-section">
                <div className="room-name">
                    <strong>Sala:</strong> {roomId} &nbsp;&nbsp;
                    <strong>Criado por:</strong> {roomName}
                </div>
                <div className="participants-list-title">
                    <strong>Participantes:</strong>
                </div>

                <ul className="participant-list">
                    {users.map((user, i) => (
                        <li key={i}>
                            {user.name} {user.hasVoted && '✔️'}{' '}
                            {userName === roomName && user.name !== userName && (
                                <span
                                    onClick={() => handleRemoveUser(user.name)}
                                    style={{ color: 'red', cursor: 'pointer', marginLeft: '8px' }}
                                    >
                                    remover
                                </span>
                            )}
                        </li>
                    ))}
                </ul>

            </div>

            {votes.length === 0 ? (
                <>
                    <h3>Escolha sua carta:</h3>
                    <div className="card-grid">
                        {cards.map((value, idx) => (
                            <div
                                key={idx}
                                className={`card ${selectedCard === value ? 'selected' : ''}`}
                                onClick={() => handleVote(value)}
                            >
                                {value}
                            </div>
                        ))}
                    </div>
                    {canReveal && (
                        <button className="buttonrevelar" onClick={handleRevealVotes}>
                            Revelar Votos
                        </button>
                    )}
                </>
            ) : (
                <>
                    <div className="results-section">
                        <div className="results-title"><strong>Resultados:</strong></div>
                        <ul className="results-list">
                            {votes.map((vote, idx) => (
                                <li key={idx}>
                                    {vote.user}: {vote.vote}
                                </li>
                            ))}
                        </ul>
                        <div className="results-average"><strong>Média: {average}</strong></div>
                    </div>
                </>
            )}

            <div className="button-row">
                <button className="buttonreset" onClick={handleResetVotes}>
                    Resetar Votação
                </button>
                <button className="button" onClick={voltarHome}>
                    Sair da Sala
                </button>
            </div>
        </div>
    );
}

export default PokerRoom;
