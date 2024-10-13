import React, {useEffect, useMemo, useRef} from 'react';
import {useAnimations} from '@react-three/drei';
import {useFrame} from '@react-three/fiber';
import {clone} from 'three/examples/jsm/utils/SkeletonUtils';
import * as THREE from 'three';
import {Vector3} from 'three';
import {useResources} from "../general/ResourceManager";
import {ReferenceNode} from "three/src/nodes/Nodes";
import {generateHexColorFromString} from "@core/tools/tools";

type PLayerComponentProps = {
    playerId:string,
    position:Vector3,

    isMoving:boolean,
    path:Array<Vector3>,
    speed:number,
    onAnimationFinish:(playerId: string) => void
}
const Player:React.FC<PLayerComponentProps> = ({playerId, isMoving, path, speed, onAnimationFinish, position})=> {
    // console.log("Player component rendered for player: ", playerId);
    //ISSUE: try to reproduce issue (sometimes a player became not visible)
    //ISSUE: try to reproduce issue (sometimes a player can move infinitive on the same position because didn't finish a movement but animation is finished)
    //ISSUE: when user switch to a not game page a player animation became infinitive (the moving end event are not emitted))
    const group = useRef<ReferenceNode<typeof group>>();
    const {models} = useResources();

    const clonedScene = useMemo(() => clone(models.player.scene), [models.player.scene]);
    const {actions} = useAnimations(models.player.animations, group);

    const currentAction = useRef<string>('');
    const switchAnimation = (newActionName: string) => {
        const prevAction = actions[currentAction.current];
        const newAction = actions[newActionName];
        group.current.lookAt(new Vector3());
        if (newAction) {
            newAction.reset().fadeIn(0.5).play();
            if (prevAction) {
                prevAction.fadeOut(0.5);
            }
            currentAction.current = newActionName;
        }
    };

    useEffect(() => {
        // Play the idle animation initially
        // Object.values(actions).forEach((action) => action?.stopFading());
        switchAnimation('Rig|idle');
        group.current.lookAt(new Vector3());
        return () => {
            Object.values(actions).forEach((action) => action?.stop());
        };
    }, [actions, group]);

    // Optional: Modify materials if needed
    useEffect(() => {
        clonedScene.traverse((child) => {
            if (child.isMesh && child.material) {
                // Clone the material to prevent shared state
                child.material = child.material.clone();
                if (child.material.name === 'business_suit_man') {
                    child.material.color.set(generateHexColorFromString(playerId));
                }
            }
        });
    }, [clonedScene, playerId]);

    // Movement logic
    const currentIndex = useRef<number>(0);
    const currentPosition = useRef<Vector3>(path[0]);
    const targetPosition = useRef<Vector3>(path[1] || path[0]);
    const direction = useRef(new THREE.Vector3().subVectors(targetPosition.current, currentPosition.current).normalize());

    useEffect(() => {
        currentIndex.current = 0;
        currentPosition.current = path[0].clone();
        targetPosition.current = (path[1] || path[0]).clone();
        direction.current.subVectors(targetPosition.current, currentPosition.current).normalize();
        if(path.length>1) {
            switchAnimation('Rig|run');
        }
    }, [path]);


    useFrame((state, delta) => {

        if (currentIndex.current < path.length - 1) {
            const moveDistance = speed * delta;
            const newPosition = currentPosition.current
                .clone()
                .add(direction.current.clone().multiplyScalar(moveDistance));
            const distanceToNext = newPosition.distanceTo(targetPosition.current);

            if (distanceToNext < 1) {
                // Reached the target, move to the next target
                currentIndex.current += 1;
                if (currentIndex.current < path.length - 1) {
                    currentPosition.current.copy(targetPosition.current);
                    targetPosition.current.set(...path[currentIndex.current + 1].toArray());
                    direction.current
                        .subVectors(targetPosition.current, currentPosition.current)
                        .normalize();
                } else {
                    // Reached the final target
                    currentPosition.current.copy(targetPosition.current);
                    if (group.current) {
                        group.current.position.copy(currentPosition.current);
                    }
                }
            } else {
                currentPosition.current.copy(newPosition);
            }

            if (group.current) {
                group.current.position.copy(currentPosition.current);
                group.current.lookAt(targetPosition.current);
            }
        } else if (isMoving && currentAction.current !== 'Rig|idle') {
            switchAnimation('Rig|idle');
            onAnimationFinish(playerId);
        }
    });

    return (<group ref={group} position={position}  dispose={null} scale={20}>
        <primitive object={clonedScene}/>
    </group>);
}
export default Player;