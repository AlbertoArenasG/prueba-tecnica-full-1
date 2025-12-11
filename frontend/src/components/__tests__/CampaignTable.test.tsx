import { render, screen, fireEvent } from '@testing-library/react';
import { CampaignTable } from '../CampaignTable';
import { Campaign } from '../../types/campaign';

const baseCampaign: Campaign = {
  name: 'campania_demo',
  tipo_campania: 'mensual',
  fecha_inicio: '2024-01-01',
  fecha_fin: '2024-01-31',
  universo_zona_metro: 100,
  impactos_personas: 200,
  impactos_vehiculos: 300,
  frecuencia_calculada: 1.2,
  frecuencia_promedio: 1.3,
  alcance: 400,
  nse_ab: null,
  nse_c: null,
  nse_cmas: null,
  nse_d: null,
  nse_dmas: null,
  nse_e: null,
  edad_0a14: null,
  edad_15a19: null,
  edad_20a24: null,
  edad_25a34: null,
  edad_35a44: null,
  edad_45a64: null,
  edad_65mas: null,
  hombres: null,
  mujeres: null
};

describe('CampaignTable', () => {
  it('renderiza campañas y ejecuta onRowClick', () => {
    const onRowClick = vi.fn();
    render(<CampaignTable data={[baseCampaign]} onRowClick={onRowClick} />);

    const row = screen.getByText(/campania_demo/i);
    fireEvent.click(row);
    expect(onRowClick).toHaveBeenCalledWith(baseCampaign);
  });

  it('muestra mensaje cuando no hay datos', () => {
    render(<CampaignTable data={[]} />);
    expect(
      screen.getByText(/No hay campañas para los filtros actuales/i)
    ).toBeInTheDocument();
  });
});
