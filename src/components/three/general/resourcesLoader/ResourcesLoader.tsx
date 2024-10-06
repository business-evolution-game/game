import React from 'react';
import {Html} from '@react-three/drei';
import './ResourcesLoader.css';
import {useLoadingManager} from "../LoadingManagerContext";

const ResourcesLoader: React.FC = () => {
    const {progress, loaded, total, progressLogs} = useLoadingManager();
    const radius = 50;
    const stroke = 10;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (<Html center style={{width: `700px`, height: `90vh`, overflowY: "scroll"}}>
        <div className="svg-container" data-cy="resource-loader-view">
            <svg height={radius * 2} width={radius * 2}>
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
            </svg>
            <div className="loading-text">
                <div className="spinner"></div>
                Loading... {Math.round(progress)}% - {loaded}/{total}
            </div>

        </div>
        {progressLogs.map((s, i) => <div key={i} className="loading-log">{s}</div>)}
    </Html>);
};

export default ResourcesLoader;