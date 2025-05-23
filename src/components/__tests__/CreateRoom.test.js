import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CreateRoom from '../CreateRoom';

describe('CreateRoom', () => {
    test('exibe alerta ao tentar criar com dados vazios', () => {
        window.alert = jest.fn();

        render(
            <BrowserRouter>
                <CreateRoom />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText('Criar'));
        expect(window.alert).toHaveBeenCalledWith('Digite um nome para sala!');
    });
});