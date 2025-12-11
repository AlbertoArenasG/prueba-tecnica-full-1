import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DateRangeForm } from '../DateRangeForm';

describe('DateRangeForm', () => {
  it('envía el formulario con las fechas seleccionadas', async () => {
    const onSubmit = vi.fn();

    render(<DateRangeForm onSubmit={onSubmit} />);

    const startInput = screen.getByLabelText(/Fecha inicio/i);
    const endInput = screen.getByLabelText(/Fecha fin/i);
    const submitButton = screen.getByRole('button', { name: /Buscar/i });

    fireEvent.change(startInput, { target: { value: '2024-01-01' } });
    fireEvent.change(endInput, { target: { value: '2024-02-01' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('2024-01-01', '2024-02-01');
    });
  });

  it('muestra error cuando la fecha fin es anterior', async () => {
    const onSubmit = vi.fn();

    render(<DateRangeForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/Fecha inicio/i), { target: { value: '2024-05-01' } });
    fireEvent.change(screen.getByLabelText(/Fecha fin/i), { target: { value: '2024-04-01' } });
    fireEvent.click(screen.getByRole('button', { name: /Buscar/i }));

    expect(await screen.findByText(/La fecha final debe ser posterior/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
