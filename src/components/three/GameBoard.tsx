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

type BoardControllerEventHandlers = (dice1: number, dice2: number) => void;

export class BoardController {
    private players: Array<Player> = [];

    private listeners = new Map<string, BoardControllerEventHandlers>;

    constructor() {
        console.log("created controller")
    }

    setPlayers(players: Array<Player>) {
        this.players = players;
    }

    getPlayers(): Array<Player> {
        return this.players;
    }

    rollDices(dice1: number, dice2: number) {
        const listener = this.listeners.get("rollDices");
        if (listener) {
            listener(dice1, dice2);
        }
    }

    useEvent(name: string, listener: BoardControllerEventHandlers) {
        this.listeners.set(name, listener);
    }
}

const GameBoard: React.FC = () => {

    const controller = useMemo(() => new BoardController(), [null]);
    useEffect(() => {
        controller.setPlayers([
            new Player("Yurii", createPosition(2, 1)),
            new Player("Bogdan", createPosition(2, 1)),
            new Player("Yulia", createPosition(2, 1)),
            new Player("Vlad", createPosition(2, 2))
        ]);

    }, [controller]);

    const handler = useCallback(() => {
        const dice1 = Math.ceil(Math.random() * 6) - 1;
        const dice2 = Math.ceil(Math.random() * 6) - 1;
        console.log(dice1 + 1, dice2 + 1)

        controller.rollDices(dice1, dice2);

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