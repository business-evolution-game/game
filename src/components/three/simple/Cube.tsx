import React from 'react';
import {} from '@react-three/drei';

export const Cube: React.FC = () => {
    return (
        <group position={[0, 30, 0]} castShadow>
            <mesh castShadow>
                <boxGeometry args={[40, 40, 40]} />
                <meshPhongMaterial color={0x557755} />
            </mesh>
            <mesh>
                <boxGeometry args={[40, 40, 40]} />
                <meshStandardMaterial color={0xffffff} wireframe />
            </mesh>
        </group>
    );
};