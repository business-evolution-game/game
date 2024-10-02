// import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
// import {WagmiProvider} from 'wagmi'
// import {config} from './wagmi.config'
//
import React from 'react';

import {createRoot} from "react-dom/client";
import './index.css'
import GameBoard from "./components/three/GameBoard";
//
// import {Provider} from 'react-redux';
// import App from './App.tsx'
//
// import store from './redux/store';

// const queryClient = new QueryClient()

createRoot(document.getElementById('root') as HTMLElement).render(<>
        <GameBoard/>
    </>

    // <Provider store={store}>
    // <WagmiProvider config={config}>
    // <QueryClientProvider client={queryClient}>
    //     <App/>
    //     </QueryClientProvider>
    //     </WagmiProvider>
    //     </Provider>
);