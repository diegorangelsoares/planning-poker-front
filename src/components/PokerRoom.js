import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import socket from '../socket';

function PokerRoom() {
    const { roomId } = useParams();
    const [users, setUsers] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [canReveal, setCanReveal] = useState(false);
    const [votes, setVotes] = useState([]);
    const [average, setAverage] = useState(null);
    const [cards, setCards] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        socket.on('updateUsers', ({ users }) => setUsers(users));
        socket.on('allVoted', () => setCanReveal(true));
        socket.on('votesRevealed', ({ votes, average }) => {
            setVotes(votes);
            setAverage(average);
        });

        socket.on('setSequence', ({ sequence }) => {
            setCards(sequence);
        });

        socket.on('votesReset', () => {
            setVotes([]);
            setSelectedCard(null);
            setCanReveal(false);
        });

        return () => {
            socket.off('updateUsers');
            socket.off('allVoted');
            socket.off('votesRevealed');
            socket.off('votesReset');
        };
    }, []);

    // useEffect(() => {
    //
    //     socket.emit('joinRoom', { roomId, userName: localStorage.getItem('userName') || 'Anônimo' });
    //
    //     socket.on('setSequence', ({ sequence }) => {
    //         setCards(sequence);
    //     });
    //
    //     socket.on('updateUsers', ({ users }) => setUsers(users));
    //     socket.on('allVoted', () => setCanReveal(true));
    //     socket.on('votesRevealed', ({ votes, average }) => {
    //         setVotes(votes);
    //         setAverage(average);
    //     });
    //     socket.on('votesReset', () => {
    //         setVotes([]);
    //         setSelectedCard(null);
    //         setCanReveal(false);
    //     });
    //
    //     return () => {
    //         socket.off('setSequence');
    //         socket.off('updateUsers');
    //         socket.off('allVoted');
    //         socket.off('votesRevealed');
    //         socket.off('votesReset');
    //     };
    // }, [roomId]);

    const handleVote = (value) => {
        setSelectedCard(value);
        socket.emit('vote', { roomId, vote: value });
    };

    const handleRevealVotes = () => socket.emit('revealVotes', roomId);
    const handleResetVotes = () => socket.emit('resetVotes', roomId);
    const voltarHome = () => navigate(`/`);

    return (
        <div className="card-box">
            <div className="info-section">
                <div className="room-name"><strong>Sala:</strong> {roomId}</div>
                <div className="participants-list-title"><strong>Participantes:</strong></div>
                <ul className="participant-list">
                    {users.map((user, i) => (
                        <li key={i}>
                            {user.name} {user.hasVoted && '✔️'}
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
                    Home
                </button>
            </div>
        </div>
    );
}

export default PokerRoom;