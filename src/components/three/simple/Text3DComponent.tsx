import React, {useMemo} from 'react';
import {extend, ReactThreeFiber, useLoader} from '@react-three/fiber';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry';;

declare global {
    namespace JSX {
        interface IntrinsicElements {
            // @ts-ignore
            textGeometry: ReactThreeFiber.GeometryNode<TextGeometry, typeof TextGeometry>;
        }
    }
}
extend({TextGeometry});


interface Text3DComponentProps {
    text: string;
    position?: [number, number, number];
    rotation?: [number, number, number];
    fontUrl: string;
    size?: number;
    depth?: number;
    color?: string;
}

const Text3DComponent: React.FC<Text3DComponentProps> = ({
                                                             text,
                                                             position = [0, 0, 0],
                                                             rotation = [0, 0, 0],
                                                             fontUrl,
                                                             size = 1,
                                                             depth = 0.2,
                                                             color = '#ffffff',
                                                         }) => {
    const font = useLoader(FontLoader, fontUrl);

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