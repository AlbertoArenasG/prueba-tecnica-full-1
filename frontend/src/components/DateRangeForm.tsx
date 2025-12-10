import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
    startDate: z.string(),
    endDate: z.string(),
}).refine(data => new Date(data.startDate) <= new Date(data.endDate), {
    message: "End date must be after start date",
    path: ["endDate"],
});

type FormData = z.infer<typeof schema>;

interface DateRangeFormProps {
    onSubmit: (startDate: string, endDate: string) => void;
}

export const DateRangeForm: React.FC<DateRangeFormProps> = ({ onSubmit }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onFormSubmit = (data: FormData) => {
        onSubmit(data.startDate, data.endDate);
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div className="flex space-x-4">
                <div className="flex-1">
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                        Start Date
                    </label>
                    <input
                        type="date"
                        id="startDate"
                        {...register('startDate')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    {errors.startDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                    )}
                </div>

                <div className="flex-1">
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                        End Date
                    </label>
                    <input
                        type="date"
                        id="endDate"
                        {...register('endDate')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    {errors.endDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                    )}
                </div>
            </div>

            <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Search
            </button>
        </form>
    );
};
