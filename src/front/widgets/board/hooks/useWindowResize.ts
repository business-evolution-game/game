import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

const useWindowResize = () => {
    const { camera, gl } = useThree();

    useEffect(() => {
        const handleResize = () => {
            const { clientWidth, clientHeight } = gl.domElement;
            // Update camera aspect ratio and projection matrix
            if (camera.isCamera) {
                // @ts-ignore
                camera.aspect = clientWidth / clientHeight;
            }
            camera.updateProjectionMatrix();
            // Update renderer size
            gl.setSize(clientWidth, clientHeight);
        };

        // Add resize event listener
        gl.domElement.addEventListener('resize', handleResize);

        // Call handleResize immediately in case the component is rendered after a resize
        handleResize();

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [camera, gl]);
};

export default useWindowResize;