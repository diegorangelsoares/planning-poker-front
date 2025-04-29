import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';

function CreateRoom() {

    const [roomName, setRoomName] = useState('');
    const [sequenceType, setSequenceType] = useState('pares');
    const [customSequence, setCustomSequence] = useState('');
    const navigate = useNavigate();

    const defaultSequences = {
        pares: ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39', '?', '☕'], // Números pares de 0 a 60,
        // pares: Array.from({ length: 31 }, (_, i) => i * 2),
        fibonacci: [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89],
        classico: ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','?'],
    };

    const handleCreateRoom = () => {
        const baseSequence =
            sequenceType === 'custom'
                ? customSequence.split(',').map((s) => s.trim())
                : defaultSequences[sequenceType];

        const sequence = [...baseSequence, '?', '☕'];

        socket.emit('createRoom', { roomName, sequence });
        navigate(`/room/${roomName}`);
    };

    const voltarHome = () => {
        navigate(`/`);
    };

    return (
        <div className="container">
            <h2>Criar Sala</h2>
            <input
                type="text"
                className="input"
                placeholder="Nome da sala"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
            />
            {/*<h3>Sequência de Cartas</h3>*/}
            {/*<select className="input" onChange={(e) => setSequenceType(e.target.value)} value={sequenceType}>*/}
            {/*    <option value="pares">Números Pares</option>*/}
            {/*    <option value="fibonacci">Fibonacci</option>*/}
            {/*    <option value="classico">Clássico</option>*/}
            {/*    <option value="custom">Personalizado</option>*/}
            {/*</select>*/}
            {/*{sequenceType === 'custom' && (*/}
            {/*    <input*/}
            {/*        type="text"*/}
            {/*        className="input"*/}
            {/*        placeholder="Ex: 1,2,3,5"*/}
            {/*        value={customSequence}*/}
            {/*        onChange={(e) => setCustomSequence(e.target.value)}*/}
            {/*    />*/}
            {/*)}*/}
            {/*<div></div>*/}
            <button  className="button" onClick={handleCreateRoom}>Criar</button>
            <div></div>
            <button  className="button" onClick={voltarHome}>Voltar</button>
        </div>
    );
}

export default CreateRoom;