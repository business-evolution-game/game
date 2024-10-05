import React, {Suspense, useCallback, useEffect, useMemo} from 'react';
import {Canvas} from '@react-three/fiber';
import {OrbitControls} from '@react-three/drei';
import {Board} from './Board';
import Light from "./simple/Light";
import Player from "../../model/Player";
import {createPosition} from "../../tools";
import {ResourceProvider} from "./general/ResourceManager";
import {LoadingManagerProvider} from "./general/LoadingManagerContext";
import ResourcesLoader from "./general/resourcesLoader/ResourcesLoader";
import useCellManager from "./hooks/useCellManager";


type BoardControllerEventHandlers = {
    movePlayer?:((playerId: string, toPosition:number ) => Promise<void>) | null,
    rollDices?:((dice1: number, dice2: number) => Promise<void>) | null,
    playersUpdated?:((players:Array<Player>) => Promise<void>) | null,
};

export class BoardController {
    private players: Array<Player> = [];

    private listeners = {} as BoardControllerEventHandlers;

    constructor() {
        console.log("created controller")
    }

    setPlayers(players: Array<Player>) {
        this.players = players;
    }

    getPlayers(): Array<Player> {
        return this.players;
    }

    async rollDices(dice1: number, dice2: number) {
        const listener = this.listeners.rollDices;
        if (listener) {
            await listener(dice1, dice2);
        }
    }

    useEvent<T extends keyof BoardControllerEventHandlers>(name:T, listener: BoardControllerEventHandlers[T]) {
        this.listeners[name] = listener;

        return ()=>{
            this.listeners[name]=null;
        }
    }

    async movePlayer(id: string, position: number):Promise<void> {

        const player = this.players.find(player => player.id === id);
        const listener = this.listeners.movePlayer;
        if (listener && player) {
            await listener(id, position);
            player.position = position;
            const listener2 = this.listeners.playersUpdated;
            if (listener2) {
                await listener2([...this.players]);
            }
        }

    }
}

const GameBoard: React.FC = () => {

    const cellManager = useCellManager();
    const controller = useMemo(() => new BoardController(), [null]);
    useEffect(() => {
        controller.setPlayers([
            new Player("Yurii", createPosition(32)),
            new Player("Bogdan", createPosition(0)),
            new Player("Yulia", createPosition(0)),
            new Player("Vlad", createPosition(0))
        ]);

    }, [controller]);

    const handler = useCallback(async () => {
        try {
            const dice1 = Math.ceil(Math.random() * 6) - 1;
            const dice2 = Math.ceil(Math.random() * 6) - 1;
            console.log("Dice value", dice1 + 1, dice2 + 1);
            const newPositionStep = (dice1+1+(controller.getPlayers()[0].position&0x3F))%35;
            const steps = cellManager.getCellCountForStep(newPositionStep);
            await controller.rollDices(dice1, dice2);
            const newPosition = createPosition(newPositionStep, steps == 1 ? 0 : 2);
            await controller.movePlayer(controller.getPlayers()[0].id, newPosition);
        }catch (e) {
            console.error(e);
        }
    }, [controller]);


    return (<Canvas shadows camera={{position: [0, 600, 400], fov: 45, near: 0.5, far: 10000}}
                    style={{width: `100vw`, height: `100vh`}}>

        <LoadingManagerProvider>
            <Suspense fallback={<ResourcesLoader/>}>
                <ResourceProvider>
                    <ambientLight intensity={0.75}/>
                    <Light/>
                    <Board controller={controller} onClick={handler}/>
                    <OrbitControls enableDamping dampingFactor={0.05} minDistance={300} maxDistance={1000}/>
                </ResourceProvider>
            </Suspense>
        </LoadingManagerProvider>
    </Canvas>);
};

export default GameBoard;