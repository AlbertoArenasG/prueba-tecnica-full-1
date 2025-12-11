import React from 'react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Campaign } from '../types/campaign';
import { format } from 'date-fns';

const formatNumber = (value: number | null | undefined) =>
    typeof value === 'number' ? value.toLocaleString() : '—';

const formatDate = (value: string | null | undefined) => {
    if (!value) return '—';
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? '—' : format(parsed, 'dd/MM/yyyy');
};

const columnHelper = createColumnHelper<Campaign>();

const columns = [
    columnHelper.accessor('name', {
        header: 'Campaña',
        cell: info => (
            <div>
                <p className="text-sm font-semibold text-slate-800">{info.getValue()}</p>
                <p className="text-xs text-slate-400">{info.row.original.tipo_campania.toUpperCase()}</p>
            </div>
        ),
    }),
    columnHelper.accessor('fecha_inicio', {
        header: 'Inicio',
        cell: info => formatDate(info.getValue()),
    }),
    columnHelper.accessor('fecha_fin', {
        header: 'Fin',
        cell: info => formatDate(info.getValue()),
    }),
    columnHelper.accessor('impactos_personas', {
        header: 'Impactos (Personas)',
        cell: info => formatNumber(info.getValue()),
    }),
    columnHelper.accessor('impactos_vehiculos', {
        header: 'Impactos (Vehículos)',
        cell: info => formatNumber(info.getValue()),
    }),
    columnHelper.accessor('alcance', {
        header: 'Alcance',
        cell: info => formatNumber(info.getValue()),
    }),
];

interface CampaignTableProps {
    data: Campaign[];
    onRowClick?: (campaign: Campaign) => void;
}

export const CampaignTable: React.FC<CampaignTableProps> = ({
    data,
    onRowClick,
}) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const rows = table.getRowModel().rows;

    return (
        <div className="table-wrapper">
            <div className="table-scroll">
                <table className="campaign-table">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="table-empty">
                                    No hay campañas para los filtros actuales
                                </td>
                            </tr>
                        ) : (
                            rows.map(row => (
                                <tr
                                    key={row.id}
                                    onClick={() => onRowClick?.(row.original)}
                                    className="table-row"
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
