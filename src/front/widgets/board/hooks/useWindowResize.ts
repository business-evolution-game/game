import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import {PerspectiveCamera, WebGLRenderer} from "three";

const useWindowResize = () => {
    const { camera, gl } = useThree<{gl:WebGLRenderer, camera: PerspectiveCamera }>();

    useEffect(() => {
        const handleResize = () => {
            const { clientWidth, clientHeight } = gl.domElement;
            if (camera.isCamera) {
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