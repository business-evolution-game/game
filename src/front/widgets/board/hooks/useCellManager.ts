import {useMemo} from 'react';
import CellManager from "../../../../model/cell/CellManager";

export default function useCellManager(){
    return  useMemo(() => new CellManager(), []);
};
