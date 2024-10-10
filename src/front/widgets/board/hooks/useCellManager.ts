import {useEffect, useMemo} from 'react';
import { useThree } from '@react-three/fiber';
import CellManager from "../../../../model/cell/CellManager";

export default function useCellManager(){
    return  useMemo(() => new CellManager(), []);
};
