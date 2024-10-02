import React from 'react';
import { useTexture } from '@react-three/drei';
import useWindowResize from "./hooks/useWindowResize";
import GameNameLabel from "./simple/GameNameLabel";

export const Board: React.FC = () => {
    useWindowResize();
    const texture = useTexture('/img/Board@4x.png');

    return (
        <>
            {/* Board */}
            <mesh position={[0, -3, 0]} receiveShadow castShadow>
                <boxGeometry args={[660, 5, 440]} />
                <meshPhongMaterial attach="material" map={texture} />
            </mesh>

            <GameNameLabel/>
            {/* Ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -50, 0]} receiveShadow>
                <planeGeometry args={[16600, 14400]} />
                <meshPhongMaterial color={0x333333} />
            </mesh>
        </>
    );
};