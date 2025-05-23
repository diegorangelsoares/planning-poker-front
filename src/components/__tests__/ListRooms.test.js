import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ListRooms from '../ListRooms';
import socket from '../../socket';

jest.mock('../../socket', () => ({
    emit: jest.fn(),
}));

describe('ListRooms', () => {
    beforeEach(() => {
        socket.emit.mockImplementation((event, callback) => {
            if (event === 'getAllRooms') {
                callback([
                    {
                        roomId: 'sala1',
                        roomName: 'Sala 1',
                        users: { u1: 'João', u2: 'Maria' },
                        sequence: [1, 2, 3],
                        revealed: false,
                        historias: [{ name: 'Tarefa A', average: 5, revealed: true }],
                    },
                    {
                        roomId: 'sala2',
                        roomName: 'Sala 2',
                        users: {},
                        sequence: ['?', 5, 8],
                        revealed: true,
                        historias: [],
                    },
                ]);
            }
        });
    });

    test('renderiza lista de salas retornadas', async () => {
        render(
            <BrowserRouter>
                <ListRooms />
            </BrowserRouter>
        );

        await waitFor(() => {
            const allIdLabels = screen.getAllByText('ID da Sala:');
            const allParagraphs = allIdLabels.map((el) => el.closest('p'));

            // Checa se os valores esperados estão contidos no texto do <p>
            expect(allParagraphs[0]).toHaveTextContent('sala1');
            expect(allParagraphs[1]).toHaveTextContent('sala2');

            expect(screen.getByText('Histórias:')).toBeInTheDocument();
            expect(screen.getByText(/Tarefa A/)).toBeInTheDocument();
        });
    });
});
