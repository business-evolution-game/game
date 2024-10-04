import React, {useEffect, useState} from 'react';
import { motion } from 'framer-motion-3d';
import { useGLTF } from '@react-three/drei';
import {useResources} from "../general/ResourceManager";

const rotationMap = [
    {x:0        , y: Math.PI/2, z:Math.PI/2}, //1
    {x:Math.PI ,  y:Math.PI,    z: Math.PI},//2
    {x:Math.PI/2, y:0,          z: 0},//3
    {x:-Math.PI/2,y:0,          z: 0}, //4
    {x:Math.PI/2, y: Math.PI/2, z:Math.PI/2}, //5?
    {x:-Math.PI/2,y: Math.PI/2, z:0}, //6
]

type animationProps = {
    init:{
        x:number,
        y:number,
        z:number,
    }
    target:{
        rotateX:number,
        rotateY:number,
        rotateZ:number,
    }
}
/**
 * @param {number} value1 - 0-5
 * @param {number} value2 - 0-5
 * @constructor
 */
export default function Dice({diceRenderIndex, value1, value2, duration}:{diceRenderIndex:number, value1: number; value2: number , duration:number}) {
    const { models } = useResources();
    const scene1 = models.dice.scene.clone(true);
    const scene2 = models.dice.scene.clone(true);


    const [animationProps, setAnimationProps] = useState([
        {
            target:{rotateX: 0, rotateY: 0, rotateZ: 0, x:-20, z: 10, y: 15, scale: 15},
            init:{rotateX: 0, rotateY: 0, rotateZ: 0, x:-75, z: 100, y: 200, scale: 40}
        },{
            target:{rotateX: 0, rotateY: 0, rotateZ:0, x:20, z: 10, y: 15, scale: 15},
            init:{rotateX: 0, rotateY: 0, rotateZ: 0, x:75, z: 100, y: 200, scale: 40}
        }
    ])
    useEffect(() => {
        setAnimationProps(prev=>[
            {
                target: {
                    ...animationProps[0].target,
                    rotateX: rotationMap[value1].x+Math.PI*4,
                    rotateY: rotationMap[value1].y+Math.PI*12,
                    rotateZ: rotationMap[value1].z+Math.PI*6,
                },
                init: {...animationProps[0].init}
            },{
                target: {
                    ...animationProps[1].target,
                    rotateX: rotationMap[value2].x+Math.PI*12,
                    rotateY: rotationMap[value2].y+Math.PI*12,
                    rotateZ: rotationMap[value2].z+Math.PI*4
                },
                init: {...animationProps[1].init}
            }
        ])
    }, [value1, value2]);

    //todo: rotate until the prop will be changed
    return (
        <>
            {/* First Dice */}
            <motion.group
                key={`dice1-${diceRenderIndex}`}
                initial={animationProps[0].init}
                animate={animationProps[0].target}
                transition={{duration, ease: "backIn"}}
            >
                <primitive object={scene1} />
            </motion.group>

             Second Dice
            <motion.group
                key={`dice2-${diceRenderIndex}`}
                initial={animationProps[1].init}
                animate={animationProps[1].target}
                transition={{duration, ease: "backIn"}}
            >
                <primitive object={scene2} />
            </motion.group>
        </>
    );
}