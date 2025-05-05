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
    const navigate = useNavigate();

    const cards = Array.from({ length: 40 }, (_, i) => String(i)).concat(['?', '☕']);

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

        return () => {
            socket.off('updateUsers');
            socket.off('allVoted');
            socket.off('votesRevealed');
            socket.off('votesReset');
        };
    }, []);

    const handleVote = (value) => {
        setSelectedCard(value);
        socket.emit('vote', { roomId, vote: value });
    };

    const handleRevealVotes = () => socket.emit('revealVotes', roomId);
    const handleResetVotes = () => socket.emit('resetVotes', roomId);
    const voltarHome = () => navigate(`/`);

    return (
        <div className="card-box">
            <h2>Sala: {roomId}</h2>
            <h3>Participantes:</h3>
            <ul>{users.map((user, i) => <li key={i}>{user}</li>)}</ul>

            {votes.length === 0 ? (
                <>
                    <h3>Escolha sua carta:</h3>
                    <div className="card-grid">
                        {cards.map((value, idx) => (
                            <div
                                key={idx}
                                className={`card ${selectedCard === value ? 'selected' : ''}`}
                                onClick={() => handleVote(value)}
                            >{value}</div>
                        ))}
                    </div>
                    {canReveal && (
                        <button className="buttonrevelar" onClick={handleRevealVotes}>Revelar Votos</button>
                    )}
                </>
            ) : (
                <>
                    <h3>Resultados:</h3>
                    <ul>
                        {votes.map((vote, idx) => <li key={idx}>{vote.user}: {vote.vote}</li>)}
                    </ul>
                    <h3>Média: {average}</h3>
                </>
            )}
            <div className="button-row">
                <button className="buttonreset" onClick={handleResetVotes}>Resetar Votação</button>
                <button className="button" onClick={voltarHome}>Voltar</button>
            </div>
        </div>
    );
}

export default PokerRoom;