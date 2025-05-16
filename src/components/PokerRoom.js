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
    const [storyText, setStoryText] = useState('');
    const [stories, setStories] = useState([]);
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

    const handleCreateStory = () => {
        if (storyText.trim() !== '') {
            socket.emit('createStory', { roomId, storyName: storyText });
            setStoryText('');
        }
    };

    const handleSelectStory = (storyId) => {
        setActiveStoryId(storyId);
        socket.emit('setActiveStory', { roomId, storyId });
        setVotes([]);
        setSelectedCard(null);
        setAverage(null);
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
            </aside>

            <main className="main-content">
                {userName === roomName && (
                    <div style={{ marginBottom: '15px' }}>
                        <input
                            type="text"
                            placeholder="Nova história"
                            value={storyText}
                            onChange={(e) => setStoryText(e.target.value)}
                            className="input input-texto"
                        />
                        <button className="button" onClick={handleCreateStory}>Cadastrar História</button>
                    </div>
                )}

                {stories.length > 0 && (
                    <div>
                        <h4>Histórias da Sala:</h4>
                        <ul className="results-list">
                            {stories.map((story) => (
                                <li
                                    key={story.id}
                                    onClick={() => handleSelectStory(story.id)}
                                    style={{
                                        fontWeight: story.id === activeStoryId ? 'bold' : 'normal',
                                        cursor: 'pointer',
                                        backgroundColor: story.id === activeStoryId ? '#d0eaff' : 'transparent'
                                    }}
                                >
                                    📝 {story.name} {story.revealed ? `| Média: ${story.average}` : ''}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

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
