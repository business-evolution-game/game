import React, {useEffect, useMemo, useState} from 'react';
import useWindowResize from "./hooks/useWindowResize";
import GameNameLabel from "./simple/GameNameLabel";
import {CellComponent} from "./CellComponent";
import PlayerComponent from "./simple/Player";
import {generateHexColorFromString} from "../../tools";
import {createCells} from "../../model/CellBuilder";

import Dice from "./simple/Dice";
import {BoardController} from "./GameBoard";
import {useResources} from "./general/ResourceManager";

export const Board: React.FC<{controller:BoardController, onClick:()=>void}> = ({controller, onClick}) => {
    useWindowResize();
    const { textures } = useResources();


    const {cells, positionMap} = useMemo(() => createCells(), []);

    const [dices, setDices] = useState([0, -1,-1]);


    useEffect(() => {
        controller.useEvent('rollDices', (dice1:number, dice2:number) => {
            setDices(prev=>[prev[0]+1, dice1, dice2]);
        });
    }, [controller]);

    console.log("render board ");
    return (
        <group onClick={(event) => { event.stopPropagation(); onClick(); }}>
            <mesh position={[0, -3, 0]} receiveShadow castShadow>
                <boxGeometry args={[660, 5, 440]} />
                <meshPhongMaterial attach="material" map={textures.board} />
            </mesh>


            {cells.map((cell, idx) => (<CellComponent key={idx} cell={cell}/>))}
            {controller.getPlayers().map((player) => {
                const currentPosition = [Number(positionMap.get(player.position)?.boardPosition.x), 0,  Number(positionMap.get(player.position)?.boardPosition.y)];
                const path:number[][] = [
                    currentPosition,
                    [currentPosition[0]+50, currentPosition[1], currentPosition[2]+120],
                    [currentPosition[0]+150, currentPosition[1], currentPosition[2]],
                ];
                return (<PlayerComponent key={player.id}
                                           color={generateHexColorFromString(player.id)}
                                           path={path}
                                           speed={50}
                                           position={currentPosition}
                                           rotation={[0, Math.PI / 2, 0]}/>
                )
            })}


            {dices[1]!=-1&&<Dice diceRenderIndex={dices[0]} value1={dices[1]} value2={dices[2]} duration={3}/>}
            {/*<GameNameLabel/>*/}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -50, 0]} receiveShadow>
                <planeGeometry args={[16600, 14400]} />
                <meshPhongMaterial color={0x333333} />
            </mesh>
        </group>
    );
};