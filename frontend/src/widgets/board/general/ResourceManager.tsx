// ResourceManager.tsx
import React, {createContext, useContext} from 'react';
import {useLoader} from '@react-three/fiber';
import {Texture, TextureLoader} from 'three';
import {GLTF, GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader';
import {Font, FontLoader} from 'three/examples/jsm/loaders/FontLoader';
import {useLoadingManager} from './LoadingManagerContext';
import useCellManager from "@widgets/board/hooks/useCellManager";

type ResourceContextType = {
    textures: {
        board: Texture;
        cells:{[key:string]:Texture}
    }; models: {
        dice: GLTF;
        player: GLTF ;
    }; fonts: { [key: string]: Font };
};

const ResourceContext = createContext<ResourceContextType | null>(null);

export const useResources = () => {
    const context = useContext(ResourceContext);
    if (!context) {
        throw new Error('useResources must be used within a ResourceProvider');
    }
    return context;
};

export const ResourceProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const cellManager = useCellManager();
    const {manager} = useLoadingManager();

    const dracoLoader = new DRACOLoader(manager);
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.3/');


    const dice = useLoader(GLTFLoader, '/models/dice.glb', (loader) => {
        loader.manager = manager;
        loader.setDRACOLoader(dracoLoader);
    });

    const player = useLoader(GLTFLoader, '/models/player.glb', (loader) => {
        loader.manager = manager;
        loader.setDRACOLoader(dracoLoader);
    });


    const board = useLoader(TextureLoader, '/img/Board@4x.png', (loader) => {
        loader.manager = manager;
    });

    const cells:{[key:string]:Texture} = {};
    for(let cell of cellManager.getCellArray()){
        if(cell.imageUrl=="") continue;
        cells[cell.imageUrl] = useLoader(TextureLoader, cell.imageUrl, (loader) => {
            loader.manager = manager;
        });
    }
    console.log(cells);

    const font = useLoader(FontLoader, '/fonts/RubikGlitchRegular.json', (loader) => {
        loader.manager = manager;
    });

    const resources: ResourceContextType = {
        textures: {
            board,
            cells
        }, models: {
            dice, player,
        }, fonts: {
            RubikGlitch: font,
        },
    };

    return (<ResourceContext.Provider value={resources}>
        {children}
    </ResourceContext.Provider>);
};