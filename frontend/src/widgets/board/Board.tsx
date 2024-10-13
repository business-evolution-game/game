import React, {useEffect, useState} from 'react';
import useWindowResize from "./hooks/useWindowResize";
import {CellComponent} from "./CellComponent";
import PlayerComponent from "./simple/Player";

import Dice from "./simple/Dice";
import {BoardController} from "./GameBoard";
import {useResources} from "./general/ResourceManager";
import useCellManager from "./hooks/useCellManager";
import {usePlayerMovement} from "./hooks/playerMovement";
import GameNameLabel from "./simple/GameNameLabel";


export const Board: React.FC<{ controller: BoardController, onClick: () => void }> = ({controller, onClick}) => {
    useWindowResize();
    const {textures} = useResources();


    const cellManager = useCellManager();

    // Dice logic
    const [dices, setDices] = useState([0, -1, -1]);
    useEffect(() => {
        return  controller.useEvent('rollDices', (dice1: number, dice2: number) => {
            setDices(prev => [prev[0] + 1, dice1, dice2]);
            return Promise.resolve(); //todo:await animation end
        });
    }, [controller]);


    const {playerMovement, handleFinishPlayerMovement, playerPositions} = usePlayerMovement(controller);


    return (<group onClick={(event) => {
        event.stopPropagation();
        onClick();
    }}>
        <mesh position={[0, -3, 0]} receiveShadow castShadow>
            <boxGeometry args={[660, 5, 440]}/>
            <meshPhongMaterial attach="material" map={textures.board}/>
        </mesh>

        {cellManager.getCellArray().map((cell, idx) => (<CellComponent key={idx} cell={cell}/>))}
        {playerPositions.map(({player, currentPosition})=> {
            let isMoving = false;
            let path = [currentPosition];
            const pm = playerMovement.find(pm=>pm.playerId==player.id);
            if(pm){
                isMoving = true;
                path = pm.path;
            }
            return <PlayerComponent key={player.id}
                isMoving={isMoving}
                playerId={player.id}
                path={path}
                speed={65}
                onAnimationFinish={handleFinishPlayerMovement}
                position={currentPosition}
            />;
        })}

        {dices[1] != -1 && <Dice diceRenderIndex={dices[0]} value1={dices[1]} value2={dices[2]} duration={0.5}/>}
        <GameNameLabel/>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -50, 0]} receiveShadow>
            <planeGeometry args={[16600, 14400]}/>
            <meshPhongMaterial color={0x333333}/>
        </mesh>
    </group>);
};