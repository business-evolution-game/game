import React, {useEffect, useMemo, useState} from 'react';
import useWindowResize from "./hooks/useWindowResize";
import {CellComponent} from "./CellComponent";
import PlayerComponent from "./simple/Player";
import {generateHexColorFromString} from "../../tools";
import {createCells} from "../../model/CellBuilder";

import Dice from "./simple/Dice";
import {BoardController} from "./GameBoard";
import {useResources} from "./general/ResourceManager";
import Player from "../../model/Player";
import {Vector3} from "three";

export const Board: React.FC<{ controller: BoardController, onClick: () => void }> = ({controller, onClick}) => {
    useWindowResize();
    const {textures} = useResources();


    const {cells, positionMap} = useMemo(() => createCells(), []);

    const [dices, setDices] = useState([0, -1, -1]);


    useEffect(() => {
        controller.useEvent('rollDices', (dice1: number, dice2: number) => {
            setDices(prev => [prev[0] + 1, dice1, dice2]);
        });
    }, [controller]);

    const players = controller.getPlayers();
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
    const playerGroupComponents: Array<React.ReactElement> = [];

    function addPlayer(key:string, player:Player, currentPosition: Vector3) {
        const path:Vector3[] = [
            currentPosition.clone(),
            currentPosition.clone().addScaledVector(new Vector3(50, 0, 120), 1),
            currentPosition.clone().addScaledVector(new Vector3(150, 0, 0), 1)
        ];
        playerGroupComponents.push(<PlayerComponent key={key}
                                                    color={generateHexColorFromString(player.id)}
                                                    path={path}
                                                    speed={50}
                                                    position={currentPosition}
                                                    rotation={[0, Math.PI / 2, 0]}/>)
    }

    console.log(playerGroups)
    playerGroups.forEach((group:Set<Player>, position) => {
        const groupArray = Array.from(group);
        groupArray.forEach((player, index) => {
            const currentPosition = new Vector3(Number(positionMap.get(position)?.boardPosition.x), 0, Number(positionMap.get(position)?.boardPosition.y));
            currentPosition.addScaledVector(
                new Vector3(
                    Math.sin(Math.PI * 2 * (index/(groupArray.length))),
                    0,
                    Math.cos(Math.PI * 2 * (index/(groupArray.length)))
                ),
                groupArray.length>1?10:0);
            addPlayer(position+""+index, player, currentPosition);
        });
    });


    return (<group onClick={(event) => {
            event.stopPropagation();
            onClick();
        }}>
            <mesh position={[0, -3, 0]} receiveShadow castShadow>
                <boxGeometry args={[660, 5, 440]}/>
                <meshPhongMaterial attach="material" map={textures.board}/>
            </mesh>


            {cells.map((cell, idx) => (<CellComponent key={idx} cell={cell}/>))}
            {playerGroupComponents.map(PlayerGroupComponent => PlayerGroupComponent)}
            {/*{controller.getPlayers().map((player) => {*/}
            {/*    const currentPosition = [Number(positionMap.get(player.position)?.boardPosition.x), 0,  Number(positionMap.get(player.position)?.boardPosition.y)];*/}
                const path:number[][] = [
                    currentPosition,
                    [currentPosition[0]+50, currentPosition[1], currentPosition[2]+120],
                    [currentPosition[0]+150, currentPosition[1], currentPosition[2]],
                ];
            {/*    return (<PlayerComponent key={player.id}*/}
            {/*                               color={generateHexColorFromString(player.id)}*/}
            {/*                               path={path}*/}
            {/*                               speed={50}*/}
            {/*                               position={currentPosition}*/}
            {/*                               rotation={[0, Math.PI / 2, 0]}/>*/}
            {/*    )*/}
            {/*})}*/}


            {dices[1] != -1 && <Dice diceRenderIndex={dices[0]} value1={dices[1]} value2={dices[2]} duration={3}/>}
            {/*<GameNameLabel/>*/}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -50, 0]} receiveShadow>
                <planeGeometry args={[16600, 14400]}/>
                <meshPhongMaterial color={0x333333}/>
            </mesh>
        </group>);
};