import { Routes, Route, useNavigate } from 'react-router-dom';
import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
import PokerRoom from './components/PokerRoom';
import './App.css';

function App() {
    const navigate = useNavigate();

    return (
        <div className="container">
            <h1 className="title">Pleini Pouquer</h1>
            <h2 className="title">Cuidado pra num errar o botão kkk</h2>
            <Routes>
                <Route path="/" element={
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <button className="button" onClick={() => navigate('/create')}>Criar Sala</button>
                        <button className="button" onClick={() => navigate('/join')}>Entrar em Sala</button>
                    </div>
                } />
                <Route path="/create" element={<CreateRoom />} />
                <Route path="/join" element={<JoinRoom />} />
                <Route path="/room/:roomId" element={<PokerRoom />} />
            </Routes>
        </div>
    );
}

export default App;
