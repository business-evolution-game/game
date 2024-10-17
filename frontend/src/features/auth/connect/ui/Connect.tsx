import React, {useCallback} from 'react';
import {Connector, useConnect} from "wagmi";
import {useAppDispatch} from "@shared/lib";
import {connect} from '@entities/user'


const Connect: React.FC = () => {

    const dispatch = useAppDispatch();
    const {connectors} = useConnect();
    const {connectAsync} = useConnect();

    const handleLogin = useCallback(async (connector: Connector) => {
        await connectAsync({connector});
        dispatch(connect());
    }, [connectAsync, dispatch]);

    return (<>
        <h2>Connect with: </h2>
        {connectors.map((connector) => (<button
            data-cy="connect-btn"
            className="p-1 hover:text-red-600 font-medium"
            key={connector.uid}
            onClick={() => handleLogin(connector)}
            type="button"
        >
            {connector.name}
        </button>))}
    </>

    );
};
/**/
export default Connect;