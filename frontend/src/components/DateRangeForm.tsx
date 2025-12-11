import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
    startDate: z.string(),
    endDate: z.string(),
}).refine(data => new Date(data.startDate) <= new Date(data.endDate), {
    message: "La fecha final debe ser posterior",
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
        <form onSubmit={handleSubmit(onFormSubmit)} className="date-form">
            <div className="filters-grid__row filters-grid__row--dates">
                <div className="filters-grid__input">
                    <label htmlFor="startDate">Fecha inicio</label>
                    <input
                        type="date"
                        id="startDate"
                        {...register('startDate')}
                    />
                    {errors.startDate && (
                        <p className="date-form__error">{errors.startDate.message}</p>
                    )}
                </div>

                <div className="filters-grid__input">
                    <label htmlFor="endDate">Fecha fin</label>
                    <input
                        type="date"
                        id="endDate"
                        {...register('endDate')}
                    />
                    {errors.endDate && (
                        <p className="date-form__error">{errors.endDate.message}</p>
                    )}
                </div>
            </div>

            <button className="date-form__search" type="submit">
                Buscar
            </button>
        </form>
    );
};
