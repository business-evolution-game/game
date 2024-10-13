import React from 'react';

type LoadingCircleProps = {
    progress:number,
    radius?:number,
    stroke?:number,
}
const LoadingCircle: React.FC<LoadingCircleProps> = ({progress, radius=50, stroke=10}) => {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (<svg height={radius * 2} width={radius * 2}>
        <circle
            stroke="#4b5563"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
        />
        <circle
            stroke="#3b82f6"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="progress-circle"
        />
    </svg>);
};

export default LoadingCircle;