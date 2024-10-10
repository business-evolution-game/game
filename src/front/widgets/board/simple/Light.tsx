import React from 'react';

function Light({color = 0xffffff, x = 0, y = 600, z = 200}) {

    return (
        <spotLight
            color={color}
            intensity={3000000}
            distance={1000000}
            castShadow
            position={[x, y, z]}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={100}
            shadow-camera-far={2000}
            shadow-camera-fov={100}
        >
        </spotLight>

    );
}

export default Light;