import Cell from "../../../../model/Cell";
import Player from "../../../../model/Player";
import {Vector3} from "three";
import {BoardController} from "../GameBoard";
import useCellManager from "./useCellManager";
import {useCallback, useEffect, useState} from "react";
import player from "../simple/Player";

export function usePlayerMovement(controller:BoardController){
    const {cellMap} = useCellManager();
    const players = controller.getPlayers();

    const [playerMovement, setPlayerMovement] = useState<Array<{
        playerId: string,
        path: Vector3[],
        onMovementFinished: () => void,
            }>>([]);

    useEffect(() => {
        return controller.useEvent('movePlayer', (playerId: string, toPosition: number): Promise<void> => new Promise((res) => {
            const player = players.find((player) => player.id === playerId);
            if (player) {
                const path: Vector3[] = [
                    modifyPlayerPosition(cellMap, players, player, player.position),
                    modifyPlayerPosition(cellMap, players, player, toPosition)
                ];

                setPlayerMovement(prev => {
                    if (prev.find(pm => pm.playerId == playerId)) {
                        return prev;
                    }

                    return [...prev, {playerId: player.id, path, onMovementFinished: res}]
                });
            }
        }))
    }, [controller, playerMovement]);

    const handleFinishPlayerMovement = useCallback((playerId:string)=>{
        const newMovement = playerMovement.find(pm=>pm.playerId==playerId);
        if(newMovement){
            newMovement.onMovementFinished();
            setPlayerMovement(playerMovement.filter(pm=>pm.playerId!=playerId));
        }

    }, [playerMovement]);

    const [playerPositions, setPlayerPositions] = useState<Array<{player:Player, currentPosition:Vector3}>>(getPlayerPositions(cellMap, players));

    useEffect(() => {
        setPlayerPositions(getPlayerPositions(cellMap, players));
    }, [playerMovement]);

    return {playerMovement, handleFinishPlayerMovement, playerPositions};
}


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
        groupArray.forEach((player) => {
            res.push({player, currentPosition:modifyPlayerPosition(cellMap, players, player, position)});
        });
    });
    return  res;
}

function modifyPlayerPosition(cellMap: Map<number, Cell>, players: Array<Player>, currentPlayer: Player, cellPosition:number) {

    const currentPosition = new Vector3(Number(cellMap.get(cellPosition)?.boardPosition.x), 0, Number(cellMap.get(cellPosition)?.boardPosition.y));

    const playerIndexes = new Map<string, number>();
    players.forEach((player:Player, index) => {
        playerIndexes.set(player.id, index);
    });

    let angle=Math.PI*2;
    let stepAngle = 2/player.length/2;
    let radius = 10;
    let start = 0;
    const angleIndex = [0,75, 17, 28].findIndex((v)=>v==cellPosition);
    if(angleIndex>-1){
        stepAngle=(Math.PI*0.3)/players.length;
        angle=Math.PI/2;
        radius=55;
        start = -Math.PI/2*(angleIndex+1)+Math.PI*0.1;
    }
    const index = (playerIndexes.get(currentPlayer.id) || 0);

    return currentPosition.clone().addScaledVector(new Vector3(
        Math.sin(start+angle+(index/players.length*stepAngle)*Math.PI*2),
        0,
        Math.cos(start+angle+(index/players.length*stepAngle)*Math.PI*2)
    ),
    radius);
}