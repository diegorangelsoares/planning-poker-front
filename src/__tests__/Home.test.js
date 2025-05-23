import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../Home';

describe('Home', () => {
    test('permite preencher nome da sala e sequência', () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText(/Nome da Sala/i), {
            target: { value: 'Sala Teste' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Sequência/i), {
            target: { value: '1,2,3,4' },
        });
        fireEvent.click(screen.getByText('Criar'));

        expect(screen.getByPlaceholderText(/Nome da Sala/i).value).toBe('Sala Teste');
        expect(screen.getByPlaceholderText(/Sequência/i).value).toBe('1,2,3,4');
    });
});