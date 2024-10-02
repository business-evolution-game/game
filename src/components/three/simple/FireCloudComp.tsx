import React, { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FireCloudProps {
    radius: number;
    height: number;
    position: THREE.Vector2;
    start:number;
    end:number;
}

function createRandomPositionInRadius(radius: number, start:number, segmentLength:number) {
    const rand = Math.random();
    const angle = start + rand * segmentLength;
    return {
        x: Math.sin(angle) * radius,
        y: Math.cos(angle) * radius,
    };
}

const FireCloud: React.FC<FireCloudProps> = React.memo(({ radius, height, position, start, end }) => {
    const particleCount = 100;
    const fireCloudRef = useRef<THREE.Points>(null);

    // Initialize particle positions
    const positions = useMemo(() => {
        const positionsArray = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            const pos = createRandomPositionInRadius(radius, start, end);
            positionsArray[i * 3 + 0] = pos.x + position.x;
            positionsArray[i * 3 + 1] = Math.random() * height;
            positionsArray[i * 3 + 2] = pos.y + position.y;
        }
        return positionsArray;
    }, [radius, height, position, particleCount]);

    // Animation loop to update the fire cloud
    useFrame(() => {
        if (fireCloudRef.current) {
            const geometry = fireCloudRef.current.geometry;
            if (geometry && geometry.attributes.position) {
                const fireParticles = geometry.attributes.position.array as Float32Array;

                for (let i = 0; i < particleCount; i++) {
                    fireParticles[i * 3 + 1] += 0.2; // Move particles up

                    // Reset position if it exceeds height
                    if (fireParticles[i * 3 + 1] > height) {
                        fireParticles[i * 3 + 1] = 0;
                        const pos = createRandomPositionInRadius(radius, start, end);
                        fireParticles[i * 3 + 0] = pos.x + position.x;
                        fireParticles[i * 3 + 2] = pos.y + position.y;
                    }
                }

                // Mark the positions attribute as needing an update
                geometry.attributes.position.needsUpdate = true;
            }
        }
    });

    return (
        <points ref={fireCloudRef}  >
            <bufferGeometry >
                <bufferAttribute
                    attach="attributes-position"
                    array={positions}
                    count={positions.length / 3}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                color={0xffff88}
                size={2}
                transparent={true}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
});

export default FireCloud;