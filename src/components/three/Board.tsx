import React, {useCallback, useEffect, useState} from 'react';
import useWindowResize from "./hooks/useWindowResize";
import {CellComponent} from "./CellComponent";
import PlayerComponent from "./simple/Player";

import Dice from "./simple/Dice";
import {BoardController} from "./GameBoard";
import {useResources} from "./general/ResourceManager";
import Player from "../../model/Player";
import {Vector3} from "three";
import useCellManager from "./hooks/useCellManager";
import GameNameLabel from "./simple/GameNameLabel";
import Cell from "../../model/Cell";


function getPlayerPositions(cellMap:Map<number, Cell>, players:Player[]):Array<{player:Player, currentPosition:Vector3}> {
    const playerGroups = new Map<number, Set<Player>>();
    for (let i = 0; i < players.length; i++) {
        let group = playerGroups.get(players[i].position);
        if (!group) {
            group = new Set<Player>([players[i]]);
            playerGroups.set(players[i].position, group);
        }
        for (let j = i + 1; j < players.length; j++) {
            if (players[i].position == players[j].position && !group.has(players[j])) {
                group.add(players[j]);
            }
        }
    }

    const res:Array<{player:Player, currentPosition:Vector3}> = [];
    playerGroups.forEach((group: Set<Player>, position) => {
        const groupArray = Array.from(group);
        groupArray.forEach((player, index) => {
            const currentPosition = new Vector3(Number(cellMap.get(position)?.boardPosition.x), 0, Number(cellMap.get(position)?.boardPosition.y));
            currentPosition.addScaledVector(new Vector3(Math.sin(Math.PI * 2 * (index / (groupArray.length))), 0, Math.cos(Math.PI * 2 * (index / (groupArray.length)))), groupArray.length > 1 ? 10 : 0);
            res.push({player, currentPosition});
        });
    });
    return  res;
}
export const Board: React.FC<{ controller: BoardController, onClick: () => void }> = ({controller, onClick}) => {
    useWindowResize();
    const {textures} = useResources();


    const cellManager = useCellManager();


    const [players, setPlayers] = useState<Array<Player>>(controller.getPlayers());


    // Dice logic
    const [dices, setDices] = useState([0, -1, -1]);
    useEffect(() => {
        const destroyRollDiceHandler =  controller.useEvent('rollDices', (dice1: number, dice2: number) => {
            setDices(prev => [prev[0] + 1, dice1, dice2]);
            return Promise.resolve(); //todo:await animation end
        });

        const destroyPlayersUpdateHandler =  controller.useEvent('playersUpdated', (players) => {
            console.log("playersUpdated event emitted")
            setPlayers(players);
            return Promise.resolve();
        });

        return ()=>{
            destroyRollDiceHandler();
            destroyPlayersUpdateHandler();
        }
    }, [controller]);


    // Player movement logic
    const [playerMovement, setPlayerMovement] = useState<{
        playerId: string,
        path: Vector3[],
        onMovementFinished: () => void,
    } | null>(null);
    useEffect(() => {
        return controller.useEvent('movePlayer', (playerId: string, toPosition: number): Promise<void> => {
            return new Promise((res) => {
                const player = players.find((player) => player.id === playerId);

                const currentPosition = new Vector3(Number(cellManager.cellMap.get(player?.position)?.boardPosition.x), 0, Number(cellManager.cellMap.get(player?.position)?.boardPosition.y));
                const targetPosition = new Vector3(Number(cellManager.cellMap.get(toPosition)?.boardPosition.x), 0, Number(cellManager.cellMap.get(toPosition)?.boardPosition.y));
                const path: Vector3[] = [currentPosition, targetPosition];

                if(!playerMovement) {
                    setPlayerMovement({playerId, path, onMovementFinished:res});
                }
            });
        });
    }, [controller, playerMovement]);


    const handleFinishPlayerMovement = useCallback((playerId:string)=>{
        console.log("player finished moving:", playerId)
        //todo: add support multiple player movement

        setPlayerMovement(prev=>{
            if(prev){
                prev.onMovementFinished();
            }
            return null;
        });
    }, []);

    const [playerPositions, setPlayerPositions] = useState<Array<{player:Player, currentPosition:Vector3}>>(getPlayerPositions(cellManager.cellMap, players));

    useEffect(() => {
        setPlayerPositions(getPlayerPositions(cellManager.cellMap, players));
    }, [playerMovement]);

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
            if(playerMovement && player.id==playerMovement.playerId){
                isMoving = true;
                path = playerMovement.path;
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