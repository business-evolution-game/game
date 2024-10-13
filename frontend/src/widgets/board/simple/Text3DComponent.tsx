import React, {useMemo} from 'react';
import {extend} from '@react-three/fiber';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry';
import {useResources} from "../general/ResourceManager";
import {BufferGeometryNode} from "@react-three/fiber/dist/declarations/src/three-types";


declare global {
    namespace JSX {
        interface IntrinsicElements {
            textGeometry: BufferGeometryNode<TextGeometry, typeof TextGeometry>;
        }
    }
}
extend({TextGeometry});


interface Text3DComponentProps {
    text: string;
    position?: [number, number, number];
    rotation?: [number, number, number];
    fontName: string;
    size?: number;
    depth?: number;
    color?: string;
}

const Text3DComponent: React.FC<Text3DComponentProps> = ({
    text,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    fontName,
    size = 1,
    depth = 0.2,
    color = '#ffffff',
}) => {
    const font = useResources().fonts[fontName];

    const textOptions = useMemo(() => ({
        font: font,
        size: size,
        depth: depth,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
    }), [font, size, depth]);

    return (<mesh position={position} rotation={rotation}>
        <textGeometry args={[text, textOptions]}/>
        <meshStandardMaterial color={color}/>
    </mesh>);
};

export default Text3DComponent;