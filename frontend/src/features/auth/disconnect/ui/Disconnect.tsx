import React, {useCallback} from 'react';
import {useDisconnect} from "wagmi";
import {useAppDispatch} from "@shared/lib";
import {disconnect} from "@entities/user";


const Disconnect: React.FC = () => {

    const dispatch = useAppDispatch();
    const {disconnectAsync} = useDisconnect();


    const handleLogout = useCallback(async () => {
        await disconnectAsync();
        dispatch(disconnect());
    },[dispatch, disconnectAsync]);

    return (<button onClick={handleLogout} className="font-medium">
            Logout
    </button>

    );
};
/**/
export default Disconnect;