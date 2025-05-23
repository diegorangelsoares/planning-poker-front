import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PokerRoom from '../PokerRoom';
import socket from '../../socket';

jest.mock('../../socket');

describe('PokerRoom', () => {
    beforeEach(() => {
        localStorage.setItem('roomId', 'sala123');
        localStorage.setItem('userName', 'João');
        jest.clearAllMocks();
        socket.__reset(); // Limpa os callbacks entre os testes
    });

    test('renderiza nome da sala e participantes ao receber roomData', async () => {
        render(
            <MemoryRouter initialEntries={['/room/sala123']}>
                <Routes>
                    <Route path="/room/:roomId" element={<PokerRoom />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            const cbs = socket.__getCallbacks();
            console.log('🧪 Callbacks registrados:', cbs);
            expect(typeof cbs.roomData).toBe('function');
        });

        act(() => {
            socket.__getCallbacks().roomData({
                roomName: 'João',
                cardOptions: ['1', '2', '3'],
                users: [{ name: 'João', hasVoted: true }],
                votes: [],
                votingOpen: true,
                stories: [],
                activeStoryId: null
            });
        });

        expect(screen.getByText('Sala: sala123')).toBeInTheDocument();
        expect(screen.getByText(/João.*✔️/)).toBeInTheDocument();
    });
});
