import React, { forwardRef, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { Cell } from '@entities/cell';
import { useResources } from '@widgets/board/general/ResourceManager';
import FireCloud from "@widgets/board/simple/FireCloudComp";

interface CellProps {
    cell:Cell
}

export const CellComponent = forwardRef<THREE.Mesh, CellProps>(({ cell }) => {
    const mesh = useRef<THREE.Mesh>(null);
    const [hovering, setHovering] = useState(false);

    const {textures} = useResources();

    let start=0;
    let end=Math.PI*2;
    let radius = 20;
    const angleIndex = [0,75, 17, 28].findIndex((v)=>v==cell.position);
    if(angleIndex>-1){
        start = -(Math.PI/2)*(angleIndex-1);
        end = -Math.PI/2;
        radius=75;
    }

    // Apply scaling and no rotation for the texture
    const texture = textures.cells[cell.imageUrl];
    if (texture) {
        // texture.repeat.set(0.5, 1); // Slight scaling to adjust the image
        texture.rotation = Math.PI/2; // No rotation
        texture.center.set(0.5, 0.5); // Ensure the scaling is centered
        texture.minFilter = THREE.LinearMipMapLinearFilter; // Smoother downscaling
        texture.magFilter = THREE.LinearFilter; // Smoother upscaling
        texture.anisotropy = 101; // Adjust anisotropy for better texture quality at oblique angles
    }

    // useEffect(() => {
    //     const geometry = mesh.current?.geometry as THREE.CylinderGeometry;
    //     if (geometry) {
    //         // Modify UV mapping to correctly project a flat image onto the cylindrical surface
    //         const uvAttribute = geometry.attributes.uv;
    //
    //         for (let i = 0; i < uvAttribute.count; i++) {
    //             const u = uvAttribute.getX(i);
    //             const v = uvAttribute.getY(i);
    //
    //             // Adjust UV coordinates to prevent stretching of the rectangular image
    //             const adjustedU = u * 0.5 + 0.25; // Map a portion of the cylindrical surface
    //             const adjustedV = v * 0.5 + 0.25; // Adjust the texture to avoid stretching
    //
    //             uvAttribute.setXY(i, adjustedU, adjustedV);
    //         }
    //         uvAttribute.needsUpdate = true;
    //     }
    // }, []);

    return (
        <group>
            {cell.imageUrl !== '' && (<mesh position={new Vector3(cell.boardPosition.x, 0, cell.boardPosition.y)}>
                <cylinderGeometry args={[radius, radius, 2, 32, 1, false, start, end]}/>
                <meshPhongMaterial attach="material" map={texture}/>
            </mesh>)}
            <mesh
                ref={mesh}
                position={new Vector3(cell.boardPosition.x, 0, cell.boardPosition.y)}
                castShadow
                receiveShadow
                onPointerOver={(event) => {
                    if (event.object.type != "Points") {
                        console.log(cell.position, cell.position & 0x3F, (cell.position & 0b11000000) >> 6)
                        setHovering(true);
                    }
                }}
                onPointerOut={(event) => {
                    if (event.object.type != "Points") {
                        setHovering(false);
                    }
                }}
            >
                <cylinderGeometry args={[radius, radius, 2, 32, 1, false, start, end]}/>

                <meshStandardMaterial color={hovering ? 0x222222 : 0x444444} transparent={true}
                                      opacity={0.4}/>


                {hovering &&
                    <FireCloud radius={radius} start={start} end={end} height={20} position={new THREE.Vector2()}/>}
            </mesh>
        </group>
    );
});