import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import socket from '../socket';

function PokerRoom() {
    const { roomId } = useParams();
    const [users, setUsers] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [canReveal, setCanReveal] = useState(false);
    const [votes, setVotes] = useState([]);
    const [average, setAverage] = useState(null);

    const cards = Array.from({ length: 31 }, (_, i) => i * 2); // Números pares de 0 a 60

    useEffect(() => {
        socket.on('updateUsers', ({ users }) => {
            setUsers(users);
        });

        socket.on('allVoted', () => {
            setCanReveal(true);
        });

        socket.on('votesRevealed', ({ votes, average }) => {
            setVotes(votes);
            setAverage(average);
        });

        return () => {
            socket.off('updateUsers');
            socket.off('allVoted');
            socket.off('votesRevealed');
        };
    }, []);

    const handleVote = (value) => {
        setSelectedCard(value);
        socket.emit('vote', { roomId, vote: value });
    };

    const handleRevealVotes = () => {
        socket.emit('revealVotes', roomId);
    };

    return (
        <div>
            <h2>ID da Sala: {roomId}</h2>

            <h3>Participantes:</h3>
            <ul>
                {users.map((user, idx) => (
                    <li key={idx}>{user}</li>
                ))}
            </ul>

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
                        <button className="button" style={{ marginTop: '20px' }} onClick={handleRevealVotes}>
                            Revelar Votos
                        </button>
                    )}
                </>
            ) : (
                <>
                    <h3>Resultados:</h3>
                    <ul>
                        {votes.map((vote, idx) => (
                            <li key={idx}>
                                {vote.user}: {vote.vote}
                            </li>
                        ))}
                    </ul>
                    <h3>Média: {average}</h3>
                </>
            )}
        </div>
    );
}

export default PokerRoom;
