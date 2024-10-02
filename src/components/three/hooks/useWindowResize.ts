import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

const useWindowResize = () => {
    const { camera, gl } = useThree();

    useEffect(() => {
        const handleResize = () => {
            const { innerWidth, innerHeight } = window;
            // Update camera aspect ratio and projection matrix
            if (camera.isCamera) {
                // @ts-ignore
                camera.aspect = innerWidth / innerHeight;
            }
            camera.updateProjectionMatrix();
            // Update renderer size
            gl.setSize(innerWidth, innerHeight);
        };

        // Add resize event listener
        window.addEventListener('resize', handleResize);

        // Call handleResize immediately in case the component is rendered after a resize
        handleResize();

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [camera, gl]);
};

export default useWindowResize;