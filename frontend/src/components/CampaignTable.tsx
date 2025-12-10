import React from 'react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Campaign } from '../types/campaign';
import { format } from 'date-fns';

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
        cell: info => format(new Date(info.getValue()), 'dd/MM/yyyy'),
    }),
    columnHelper.accessor('fecha_fin', {
        header: 'Fecha Fin',
        cell: info => format(new Date(info.getValue()), 'dd/MM/yyyy'),
    }),
    columnHelper.accessor('impactos_personas', {
        header: 'Impactos (Personas)',
        cell: info => info.getValue().toLocaleString(),
    }),
    columnHelper.accessor('impactos_vehiculos', {
        header: 'Impactos (Vehículos)',
        cell: info => info.getValue().toLocaleString(),
    }),
    columnHelper.accessor('alcance', {
        header: 'Alcance',
        cell: info => info.getValue().toLocaleString(),
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

    return (
        <div className="overflow-x-auto">
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
                    {table.getRowModel().rows.map(row => (
                        <tr
                            key={row.id}
                            onClick={() => onRowClick?.(row.original)}
                            className="hover:bg-gray-100 cursor-pointer"
                        >
                            {row.getVisibleCells().map(cell => (
                                <td
                                    key={cell.id}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                >
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
