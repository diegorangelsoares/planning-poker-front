import { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import socket from '../socket';

function PokerRoom() {
    const { roomId } = useParams();
    const [users, setUsers] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [canReveal, setCanReveal] = useState(false);
    const [votes, setVotes] = useState([]);
    const [average, setAverage] = useState(null);
    const navigate = useNavigate();

    const cards = ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39', '?', '☕']; // Números pares de 0 a 60

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

    const handleRevealVotes = () => {
        socket.emit('revealVotes', roomId);
    };

    const voltarHome = () => {
        navigate(`/`);
    };

    const handleResetVotes = () => {
        socket.emit('resetVotes', roomId);
    };

    return (
        <div>
            <h2>Sala: {roomId}</h2>

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
            <button className="button" onClick={voltarHome}>Voltar</button>
            <div></div>
            <button className="button button-margin-top" onClick={handleResetVotes}>
                Resetar Votação
            </button>
        </div>

    );
}

export default PokerRoom;
