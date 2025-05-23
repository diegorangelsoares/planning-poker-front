import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import JoinRoom from '../JoinRoom';
import socket from '../../socket';

jest.mock('../../socket', () => ({
    emit: jest.fn(),
}));

describe('JoinRoom', () => {
    test('exibe erro se campos estiverem vazios', () => {
        render(<BrowserRouter><JoinRoom /></BrowserRouter>);
        fireEvent.click(screen.getByText('Entrar'));
        expect(screen.getByText('Informe o ID da sala e seu nome.')).toBeInTheDocument();
    });
});
