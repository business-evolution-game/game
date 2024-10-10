import React from 'react';
import {} from '@react-three/drei';

export const Cube: React.FC = ({...props}) => {
    return (
        <group {...props} castShadow>
            <mesh castShadow>
                <boxGeometry args={[5, 50, 5]} />
                <meshPhongMaterial color={0x557755} />
            </mesh>
        </group>
    );
};