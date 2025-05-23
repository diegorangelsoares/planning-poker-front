import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
import PokerRoom from './components/PokerRoom';
import ListRooms from './components/ListRooms';
import './App.css';

function App() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
            <Link to="/" className="text-4xl font-bold text-blue-700 mb-2 cursor-pointer">
                Pleini Pouquer
            </Link>
            <h2 className="text-lg text-gray-500 mb-6">🤼🏾‍♂️🎲 Cuidado pra num errar o butãum 🃏💡</h2>
            <div className="watermark">
                <img src="/fundo.png" alt="Marca d'água" />
            </div>
            <Routes>
                <Route path="/" element={
                    <div className="flex flex-col gap-4 w-full max-w-md">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl shadow-md" onClick={() => navigate('/create')}>Criar Sala</button>
                        <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl shadow-md" onClick={() => navigate('/join')}>Entrar em Sala</button>
                    </div>
                } />
                <Route path="/create" element={<CreateRoom />} />
                <Route path="/join" element={<JoinRoom />} />
                <Route path="/room/:roomId" element={<PokerRoom />} />
                <Route path="/rooms" element={<ListRooms />} />
            </Routes>
        </div>
    );
}

export default App;