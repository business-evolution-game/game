import React from 'react';
import { Canvas} from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Board } from './Board';
import { Cube } from './simple/Cube';
import { CellComponent } from './CellComponent';
import Light from "./simple/Light";
import Cell from "../../model/Cell";
import {createCells} from "../../model/CellBuilder";




const GameBoard: React.FC = () => {


    let cells:Array<Cell> = createCells()

    return (
        <Canvas shadows camera={{ position: [0, 600, 400], fov: 45, near: 0.5, far: 10000 }}>
            <ambientLight intensity={0.75} />
            <Light/>
            <Cube />
            <Board />
            {cells.map((cell, idx) => (
                <CellComponent
                    key={idx}
                    cell={cell}
                />
            ))}

            <OrbitControls enableDamping dampingFactor={0.05} minDistance={300} maxDistance={1000} />
        </Canvas>
    );
};

export default GameBoard;