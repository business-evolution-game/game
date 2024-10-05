import React, { forwardRef, useRef, useState } from 'react';
import * as THREE from 'three';
import FireCloud from './simple/FireCloudComp';
import Cell from "../../model/Cell";
import {Vector3} from "three";

interface CellProps {
    cell:Cell
}

export const CellComponent = forwardRef<THREE.Mesh, CellProps>(({cell}, ref) => {
    const mesh = useRef<THREE.Mesh>(null);
    const [hovering, setHovering] = useState(false);

    let start=0;
    let end=Math.PI*2;
    let radius = 20;
    const angleIndex = [0,75, 17, 28].findIndex((v)=>v==cell.position);
    if(angleIndex>-1){
        start = -(Math.PI/2)*(angleIndex-1);
        end = -Math.PI/2;
        radius=75;
    }

    return (
        <mesh
            ref={mesh}
            position={new Vector3(cell.boardPosition.x, 0, cell.boardPosition.y)}
            castShadow
            receiveShadow
            onPointerOver={(event) => {
                if (event.object.type!="Points") {
                    console.log(cell.position, cell.position&0x3F, (cell.position&0b11000000)>>6)
                    setHovering(true);
                }
            }}
            onPointerOut={(event) => {
                if (event.object.type!="Points") {
                    setHovering(false);
                }
            }}
        >
            <cylinderGeometry args={[radius, radius, 2, 32, 1, false, start, end]} />
            <meshStandardMaterial color={hovering?0x444444:0x222222}/>
            {hovering && <FireCloud radius={radius} start={start} end={end} height={20} position={new THREE.Vector2()} />}
        </mesh>
    );
});