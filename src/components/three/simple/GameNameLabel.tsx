import React from 'react';
import { motion } from 'framer-motion-3d';
import Text3DComponent from "./Text3DComponent";

export default function GameNameLabel() {
    return (
        <motion.group
            initial={{scale:10}}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "backIn" }}
        >
            <Text3DComponent
                text="BUSINESS"
                position={[-90, 0, -5]}
                rotation={[-Math.PI/2, 0, 0]}
                fontUrl="/fonts/RubikGlitchRegular.json"
                size={25}
                color="#606060"
            />
            <Text3DComponent
                text="EVOLUTION"
                position={[-100, 0, 25]}
                rotation={[-Math.PI/2, 0, 0]}
                fontUrl="/fonts/RubikGlitchRegular.json"
                size={25}
                color="#606060"
            />
        </motion.group>
    );
}