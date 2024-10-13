import React from 'react';
import {Html} from '@react-three/drei';
import './ResourcesLoader.css';
import {useLoadingManager} from "../LoadingManagerContext";
import LoadingCircle from "../../../../shared/ui/loader/LoadingCircle";

const ResourcesLoader: React.FC = () => {
    const {progress, loaded, total, progressLogs} = useLoadingManager();

    return (<Html center style={{width: `700px`, height: `90vh`, overflowY: "scroll"}}>
        <div className="svg-container" data-cy="resource-loader-view">
            <LoadingCircle progress={progress} />
            <div className="loading-text">
                Loading... {Math.round(progress)}% - {loaded}/{total}
            </div>

        </div>
        {progressLogs.map((s, i) => <div key={i} className="loading-log">{s}</div>)}
    </Html>);
};

export default ResourcesLoader;