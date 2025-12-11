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
        header: 'Nombre',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('tipo_campania', {
        header: 'Tipo',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('fecha_inicio', {
        header: 'Fecha Inicio',
        cell: info => formatDate(info.getValue()),
    }),
    columnHelper.accessor('fecha_fin', {
        header: 'Fecha Fin',
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
        <div className="overflow-x-auto border rounded-md shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
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
                <tbody className="bg-white divide-y divide-gray-200">
                    {rows.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-6 py-6 text-center text-sm text-gray-500"
                            >
                                No campaigns found for the selected filters.
                            </td>
                        </tr>
                    ) : (
                        rows.map(row => (
                            <tr
                                key={row.id}
                                onClick={() => onRowClick?.(row.original)}
                                className="hover:bg-gray-100 cursor-pointer"
                            >
                                {row.getVisibleCells().map(cell => (
                                    <td
                                        key={cell.id}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                                    >
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
    );
};
