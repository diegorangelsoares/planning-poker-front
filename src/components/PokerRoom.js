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
    const [stories, setStories] = useState([]);
    const [storyInput, setStoryInput] = useState('');
    const [activeStoryId, setActiveStoryId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedRoomId = localStorage.getItem('roomId');
        const savedUserName = localStorage.getItem('userName');

        if (savedRoomId && savedUserName) {
            socket.emit('checkRoomExists', savedRoomId, ({ exists }) => {
                if (exists) {
                    socket.emit('joinRoom', { roomId: savedRoomId, userName: savedUserName }, () => {
                        socket.emit('getRoomData', savedRoomId);
                        setRoomId(savedRoomId);
                        setUserName(savedUserName);
                    });
                } else {
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

        return () => socket.off('removed');
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
        socket.on('setSequence', ({ sequence }) => setCards(sequence));
        socket.on('roomInfo', ({ roomName }) => setRoomName(roomName));
        socket.on('roomData', ({ roomName, cardOptions, users, votes, votingOpen, stories, activeStoryId }) => {
            setRoomName(roomName);
            setCards(cardOptions);
            setUsers(users);
            setStories(stories || []);
            setActiveStoryId(activeStoryId || null);
            if (!votingOpen) {
                setVotes(votes);
                setCanReveal(false);
                setAverage('?');
            }
        });
        socket.on('storyAdded', ({ stories, activeStoryId }) => {
            setStories(stories);
            setActiveStoryId(activeStoryId);
        });

        return () => {
            socket.off('updateUsers');
            socket.off('allVoted');
            socket.off('votesRevealed');
            socket.off('votesReset');
            socket.off('setSequence');
            socket.off('roomInfo');
            socket.off('roomData');
            socket.off('storyAdded');
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

    const handleAddStory = () => {
        if (storyInput.trim()) {
            socket.emit('addStory', { roomId, storyName: storyInput });
            setStoryInput('');
        }
    };

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="room-name">
                    Sala: {roomId}<br />
                    Dono: <span style={{ color: '#007bff' }}>{roomName}</span>
                </div>
                <div className="participants-title">Participantes:</div>
                <ul className="participant-list">
                    {users.map((user, i) => (
                        <li key={i}>
                            <span>
                                {user.name} {user.hasVoted && '✔️'}
                            </span>
                            {userName === roomName && user.name !== userName && (
                                <span
                                    onClick={() => handleRemoveUser(user.name)}
                                    style={{ color: 'red', cursor: 'pointer' }}
                                >
                                    ❌
                                </span>
                            )}
                        </li>
                    ))}
                </ul>

                <div style={{ marginTop: '20px' }}>
                    <input
                        type="text"
                        value={storyInput}
                        onChange={(e) => setStoryInput(e.target.value)}
                        placeholder="Nova história (32 caracteres)"
                        className="input input-texto-historia"
                        maxLength={32}
                    />
                    <button className="buttonCadastrarHistoria" onClick={handleAddStory}>Cadastrar História</button>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <strong>Histórias da Sala:</strong>
                    <ul className="participant-list">
                        {stories.map((story, idx) => (
                            <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span>
                                    📝 {story.name}
                                      {story.revealed && ` - Média: ${story.average}`}
                                      {story.id === activeStoryId && ' (Ativa)'}
                                  </span>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    {story.id !== activeStoryId && (
                                        <>
                                            <button
                                                className="button"
                                                style={{ padding: '4px 8px', fontSize: '12px' }}
                                                onClick={() => socket.emit('setActiveStory', { roomId, storyId: story.id })}
                                            >
                                                Votar
                                            </button>
                                            {userName === roomName && (
                                                <button
                                                    className="button"
                                                    style={{ padding: '4px 8px', fontSize: '12px', backgroundColor: '#e74c3c' }}
                                                    onClick={() => socket.emit('deleteStory', { roomId, storyId: story.id })}
                                                >
                                                    🗑️
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>

                </div>
            </aside>

            <main className="main-content">
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
                                👁️ Revelar Votos
                            </button>
                        )}
                    </>
                ) : (
                    <div className="results-panel">
                        <h3>📊 Resultados:</h3>
                        <ul>
                            {votes.map((vote, idx) => (
                                <li key={idx}>
                                    {vote.user}: {vote.vote}
                                </li>
                            ))}
                        </ul>
                        <div className="average">Média: {average}</div>
                    </div>
                )}

                <div className="button-row">
                    <button className="buttonreset" onClick={handleResetVotes}>🔄 Resetar</button>
                    <button className="button" onClick={voltarHome}>🚪 Sair da Sala</button>
                </div>
            </main>
        </div>
    );
}

export default PokerRoom;
