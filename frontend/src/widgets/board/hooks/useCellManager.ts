import {useMemo} from 'react';
import {CellManager} from "@entities/cell";

export default function useCellManager(){
    return  useMemo(() => new CellManager(), []);
};
