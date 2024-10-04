import React, { useRef, useEffect, useMemo } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils';
import * as THREE from 'three';
import {useResources} from "../general/ResourceManager";

export default function Player({color="#ffffff", path = [[0, 0, 0]], speed = 1, ...props }) {
    const group = useRef();
    const { models } = useResources();

    // Clone the scene to create a unique instance
    const clonedScene = useMemo(() => clone(models.player.scene), [models.player.scene]);

    // Use animations with the cloned scene
    const { actions } = useAnimations(models.player.animations, group);

    // Ref to keep track of the current action
    const currentAction = useRef(null);

    // Helper function to switch animations
    const switchAnimation = (newActionName) => {
        if (currentAction.current !== newActionName) {
            const prevAction = actions[currentAction.current];
            const newAction = actions[newActionName];

            if (newAction) {
                newAction.reset().fadeIn(0.5).play();
                if (prevAction) {
                    prevAction.fadeOut(0.5);
                }
                currentAction.current = newActionName;
            }
        }
    };

    useEffect(() => {
        // Play the idle animation initially
        switchAnimation('Rig|idle');

        return () => {
            // Stop all actions on unmount
            Object.values(actions).forEach((action) => action.stop());
        };
    }, [actions]);

    // Optional: Modify materials if needed
    useEffect(() => {
        clonedScene.traverse((child) => {
            if (child.isMesh && child.material) {
                // Clone the material to prevent shared state
                child.material = child.material.clone();
                if (child.material.name === 'business_suit_man') {
                    child.material.color.set(color);
                }
            }
        });
    }, [clonedScene]);

    // Movement logic
    const currentIndex = useRef(0);
    const currentPosition = useRef(new THREE.Vector3(...path[0]));
    const targetPosition = useRef(new THREE.Vector3(...path[1] || path[0]));
    const direction = useRef(
        new THREE.Vector3().subVectors(targetPosition.current, currentPosition.current).normalize()
    );

    useFrame((state, delta) => {
        let isMoving = false;

        if (currentIndex.current < path.length - 1) {
            const moveDistance = speed * delta;
            const newPosition = currentPosition.current
                .clone()
                .add(direction.current.clone().multiplyScalar(moveDistance));
            const distanceToNext = newPosition.distanceTo(targetPosition.current);

            isMoving = true;

            if (distanceToNext < 1) {
                // Reached the target, move to the next target
                currentIndex.current += 1;
                if (currentIndex.current < path.length - 1) {
                    currentPosition.current.copy(targetPosition.current);
                    targetPosition.current.set(...path[currentIndex.current + 1]);
                    direction.current
                        .subVectors(targetPosition.current, currentPosition.current)
                        .normalize();
                } else {
                    // Reached the final target
                    currentPosition.current.copy(targetPosition.current);
                    if (group.current) {
                        group.current.position.copy(currentPosition.current);
                    }
                    isMoving = false;
                }
            } else {
                currentPosition.current.copy(newPosition);
            }

            if (group.current) {
                group.current.position.copy(currentPosition.current);
                // Rotate the player to face the movement direction
                group.current.lookAt(targetPosition.current);
            }
        } else {
            isMoving = false;
        }

        // Switch animations based on movement state
        if (isMoving) {
            switchAnimation('Rig|run');
        } else {
            switchAnimation('Rig|idle');
        }
    });

    return (
        <group ref={group} {...props} dispose={null} scale={20}>
            <primitive object={clonedScene} />
        </group>
    );
}