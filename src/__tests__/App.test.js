import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

test('renders "Criar Sala" button', () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <App />
        </MemoryRouter>
    );

    const criarSalaButton = screen.getByText(/Criar Sala/i);
    expect(criarSalaButton).toBeInTheDocument();
});