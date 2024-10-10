import React, {useEffect, useState} from 'react';
import PageTemplate from "@pages/PageTemplate";
import LoadingCircle from "@shared/ui/loader/LoadingCircle";


function LoadingPage() {
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setProgress(prev => (prev < 100 ? prev + 1 : 100));
            }, 50);

            if (progress === 100) {
                setLoading(false);
                clearInterval(interval);
            }

            return () => clearInterval(interval); // Cleanup interval
        }
    }, [loading]);

    return (<PageTemplate>
        <div className={"flex justify-center items-center w-full"}>
            <div className={"mb-40"}>
                <LoadingCircle progress={progress}/>
            </div>
        </div>
    </PageTemplate>);
}

export default LoadingPage;