import React from 'react';

interface Props {
    columns: number;
    rows?: number;
}

export const SkeletonTable: React.FC<Props> = ({ columns, rows = 5 }) => {
    return (
        <div className="skeleton-table">
            <div className="skeleton-table__header">
                {Array.from({ length: columns }).map((_, index) => (
                    <div key={index} className="skeleton skeleton--header" />
                ))}
            </div>
            <div className="skeleton-table__body">
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div key={rowIndex} className="skeleton-row">
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className="skeleton skeleton--cell"
                                style={{ animationDelay: `${colIndex * 0.05}s` }}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};
