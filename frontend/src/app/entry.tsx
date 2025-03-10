import React from 'react';
import {createRoot} from 'react-dom/client';
import {Provider as ReduxProvider} from 'react-redux';
import {WagmiProvider} from 'wagmi';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import '@shared/ui/base.css';
import {config} from '@shared/api/wagmi';

import App from "./App";
import {store} from './store';

const queryClient = new QueryClient()

// createRoot(document.getElementById('root') as HTMLElement).render(<><GameBoard/></>);

createRoot(document.getElementById('root')!).render(<React.StrictMode>
    <ReduxProvider store={store}>
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <App/>
            </QueryClientProvider>
        </WagmiProvider>
    </ReduxProvider>
</React.StrictMode>);