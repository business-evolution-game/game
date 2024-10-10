import React, { createContext, useContext, useEffect, useRef } from 'react';
import { LoadingManager } from 'three';

type LoadingManagerContextType = {
    manager: LoadingManager;
    progress: number;
    loaded: number;
    total: number;
    progressLogs: string[];
};

const LoadingManagerContext = createContext<LoadingManagerContextType | null>(null);

export const useLoadingManager = () => {
    const context = useContext(LoadingManagerContext);
    if (!context) {
        throw new Error('useLoadingManager must be used within a LoadingManagerProvider');
    }
    return context;
};

export const LoadingManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [itemsLoaded, setItemsLoaded] = React.useState(0);
    const [itemsTotal, setItemsTotal] = React.useState(0);
    const [progress, setProgress] = React.useState(0);
    const [progressLogs, setProgressLogs] = React.useState<string[]>([]);

    const managerRef = useRef<LoadingManager>();

    if (!managerRef.current) {
        managerRef.current = new LoadingManager();
    }

    const manager = managerRef.current;

    useEffect(() => {
        manager.onStart = (url, loaded, total) => {
            // Defer state updates to avoid setState during render
            Promise.resolve().then(() => {
                setItemsLoaded(loaded);
                setItemsTotal(total);
                setProgress((loaded / total) * 100);
            });
        };

        manager.onProgress = (url, loaded, total) => {
            Promise.resolve().then(() => {
                setItemsLoaded(loaded);
                setItemsTotal(total);
                setProgress((loaded / total) * 100);
                setProgressLogs(prev=>[...prev,`${url}`]);
            });
        };

        manager.onLoad = () => {
            Promise.resolve().then(() => {
                setItemsLoaded(itemsTotal);
                setProgress(100);
            });
        };

        manager.onError = (url) => {
            setProgressLogs(prev=>[...prev,`Error loading ${url}`]);
        };
    }, [manager, itemsTotal]);

    return (
        <LoadingManagerContext.Provider value={{ manager, progress, loaded:itemsLoaded, total:itemsTotal, progressLogs }}>
            {children}
        </LoadingManagerContext.Provider>
    );
};