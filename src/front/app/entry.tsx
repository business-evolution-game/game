import '@shared/ui/base.css';

// import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import React from 'react';
import ReactDOM from 'react-dom/client';

import {Provider as ReduxProvider} from 'react-redux';
import {WagmiProvider} from 'wagmi';

import App from "./App";
import {store} from './store';

import {config} from '../wagmi.config'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient()

// createRoot(document.getElementById('root') as HTMLElement).render(<><GameBoard/></>);

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode>
    <ReduxProvider store={store}>
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <App/>
            </QueryClientProvider>
        </WagmiProvider>
    </ReduxProvider>
</React.StrictMode>);